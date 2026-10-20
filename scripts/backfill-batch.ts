/**
 * backfill-batch.ts — 수집이 멈춘 기간을 날짜별로 다시 모으고, 스크리닝·요약을 Batch API(50% 할인)로 돌린다.
 *
 *   npx tsx scripts/backfill-batch.ts collect   --from 2026-07-13 --to 2026-10-19
 *   npx tsx scripts/backfill-batch.ts summarize
 *
 * - collect: 날마다 arXiv(submittedDate)·HF daily_papers·HN(Algolia, points≥50) 후보 → Haiku 배치 스크리닝
 *   → 하루치를 평소 파이프라인과 같은 규칙으로 고른다(논문 score≥7 top 2, HN score≥6 top 10, 500점 이상 자동 통과).
 * - summarize: DB 글 전부 → Sonnet 배치로 v2 재요약(prompts-v2.ts, 한·영 동시, 구조화 출력). 다시 돌리면 남은 것만.
 * - Reddit은 지난 글을 날짜로 가져올 방법이 없어 뺀다.
 * - 배치 id는 .cache/backfill/*.json에 남겨 중간에 끊겨도 같은 배치 결과를 다시 읽는다.
 */
import Anthropic from '@anthropic-ai/sdk';
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'fs';
import { XMLParser } from 'fast-xml-parser';
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { calculateHotScore } from '../src/lib/hot-scorer';
import { fetchPdfText } from '../src/lib/pdf-fetcher';
import { fetchContent } from '../src/lib/content-fetcher';
import { fetchHNComments } from '../src/lib/hacker-news/client';
import { PAPER_PROMPT_V2, COMMUNITY_PROMPT_V2, SUMMARY_SCHEMA_V2, toPaperRow } from '../src/lib/claude/prompts-v2';

const SCREEN_MODEL = 'claude-haiku-5-5';
const SUMMARY_MODEL = 'claude-sonnet-5-5';
const CACHE = '.cache/backfill';
const client = new Anthropic();
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// screener.ts의 프롬프트를 그대로 쓴다(export 안 돼 있어 파일에서 읽음)
const screenerSrc = readFileSync('src/lib/claude/screener.ts', 'utf8');
const prompt = (name: string) => {
  const m = screenerSrc.match(new RegExp(`const ${name} = \`([\\s\\S]*?)\`;`));
  if (!m) throw new Error(`${name} not found`);
  return m[1];
};
const PAPER_SCREEN = prompt('PAPER_SCREEN_PROMPT');
const HN_SCREEN = prompt('HN_SCREEN_PROMPT');

const AI_KEYWORDS = ['AI', 'LLM', 'GPT', 'Claude', 'machine learning', 'deep learning', 'neural', 'transformer',
  'language model', 'ChatGPT', 'OpenAI', 'Anthropic', 'RAG', 'agent', 'fine-tuning', 'embedding', 'prompt',
  'diffusion', 'Gemini', 'Llama', 'Mistral', 'Qwen', 'DeepSeek', 'Grok', 'o1', 'o3', 'Sora', 'Copilot',
  'Cursor', 'Perplexity', 'Stable Diffusion', 'Flux', 'Manus'];
// 짧은 키워드(AI·RAG·o1)가 storage·said 같은 단어 안에서 걸리지 않게 단어 경계로 본다
const AI_RE = new RegExp(`\\b(${AI_KEYWORDS.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})s?\\b`, 'i');
const SCREEN_SCHEMA = { type: 'object', properties: { pass: { type: 'boolean' }, score: { type: 'integer' }, reason: { type: 'string' } },
  required: ['pass', 'score', 'reason'], additionalProperties: false };
const PRACTICAL = ['prompting', 'prompt engineering', 'RAG', 'retrieval-augmented', 'agent', 'tool use',
  'function calling', 'fine-tuning', 'LoRA', 'RLHF', 'DPO', 'inference', 'quantization', 'distillation', 'eval',
  'benchmark', 'code generation', 'in-context learning', 'chain-of-thought', 'embedding', 'chunking', 'vector search'];

type Cand =
  | { kind: 'arxiv' | 'hf'; day: string; id: string; title: string; abstract: string; authors: string[];
      categories: string[]; primaryCategory: string; publishedAt: string; updatedAt?: string }
  | { kind: 'hn'; day: string; id: string; title: string; url?: string; points: number; by: string; time: number };

function days(from: string, to: string): string[] {
  const out: string[] = [];
  for (let d = new Date(from + 'T00:00:00Z'); d <= new Date(to + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + 1))
    out.push(d.toISOString().slice(0, 10));
  return out;
}

async function getJson(url: string, tries = 6): Promise<any> {
  for (let i = 1; i <= tries; i++) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 AI-Paper-Digest/1.0' } });
    if (res.ok) return url.includes('arxiv.org') ? res.text() : res.json();
    console.log(`  ${res.status} ${url.slice(0, 80)} (${i}/${tries})`);
    await sleep(res.status === 429 ? 60_000 : 15_000);
  }
  throw new Error(`fetch failed: ${url}`);
}

async function arxivDay(day: string): Promise<Cand[]> {
  const ymd = day.replace(/-/g, '');
  const cat = ['cs.AI', 'cs.CL', 'cs.LG'].map(c => `cat:${c}`).join('+OR+');
  const abs = PRACTICAL.map(k => `abs:${encodeURIComponent(`"${k}"`)}`).join('+OR+');
  const q = `(${cat})+AND+(${abs})+AND+submittedDate:[${ymd}0000+TO+${ymd}2359]`;
  const xml = await getJson(`https://export.arxiv.org/api/query?search_query=${q}&sortBy=submittedDate&sortOrder=descending&max_results=100`);
  const entries = new XMLParser({ ignoreAttributes: false }).parse(xml).feed?.entry;
  if (!entries) return [];
  return (Array.isArray(entries) ? entries : [entries]).map((e: any) => {
    const id = String(e.id).split('/abs/').pop()!.replace(/v\d+$/, '');
    const arr = (x: any) => (Array.isArray(x) ? x : [x]);
    return {
      kind: 'arxiv' as const, day, id,
      title: String(e.title).replace(/\s+/g, ' ').trim(),
      abstract: String(e.summary).replace(/\s+/g, ' ').trim(),
      authors: arr(e.author).map((a: any) => String(a.name)),
      categories: arr(e.category).map((c: any) => String(c['@_term'])),
      primaryCategory: String(e['arxiv:primary_category']?.['@_term'] ?? ''),
      publishedAt: String(e.published), updatedAt: String(e.updated),
    };
  });
}

async function hfDay(day: string): Promise<Cand[]> {
  try {
    const list = await getJson(`https://huggingface.co/api/daily_papers?date=${day}&limit=40`, 2);
    return list.map((x: any) => ({
      kind: 'hf' as const, day, id: x.paper.id, title: x.paper.title, abstract: x.paper.summary ?? x.paper.title,
      authors: (x.paper.authors ?? []).map((a: any) => a.name), categories: [], primaryCategory: 'cs.AI',
      publishedAt: x.paper.publishedAt ?? x.publishedAt,
    }));
  } catch { return []; }
}

async function hnDay(day: string): Promise<Cand[]> {
  const a = Date.parse(day + 'T00:00:00Z') / 1000, b = a + 86400;
  const r = await getJson(`https://hn.algolia.com/api/v1/search?tags=story&hitsPerPage=1000&numericFilters=created_at_i>=${a},created_at_i<${b},points>=50`);
  return r.hits
    .filter((h: any) => h.title && AI_RE.test(h.title))
    .map((h: any) => ({ kind: 'hn' as const, day, id: `hn_${h.objectID}`, title: h.title, url: h.url,
      points: h.points, by: h.author, time: h.created_at_i }));
}

// 배치 제출 → 끝날 때까지 대기 → custom_id별 텍스트. 같은 이름 배치는 다시 만들지 않는다.
// 이 맥에서 api.anthropic.com으로 300KB 넘게 올리면 TLS가 자주 깨진다(bad record mac/EPIPE) →
// 요청을 150KB 안팎 묶음으로 쪼개 따로 내고, 묶음마다 다시 시도한다. 낸 묶음 id는 바로 저장해 이어서 낼 수 있게 한다.
const PART_BYTES = 150_000;
async function runBatch(name: string, reqs: { custom_id: string; params: any }[]): Promise<Map<string, string>> {
  mkdirSync(CACHE, { recursive: true });
  const f = `${CACHE}/${name}.batch.json`;
  const parts: { custom_id: string; params: any }[][] = [[]];
  let size = 0;
  for (const r of reqs) {
    const n = Buffer.byteLength(JSON.stringify(r));
    if (size + n > PART_BYTES && parts.at(-1)!.length) { parts.push([]); size = 0; }
    parts.at(-1)!.push(r); size += n;
  }
  const ids: string[] = existsSync(f) ? (JSON.parse(readFileSync(f, 'utf8')).ids ?? []) : [];
  for (let i = ids.length; i < parts.length; i++) {
    for (let t = 1; ; t++) {
      try { ids.push((await client.messages.batches.create({ requests: parts[i] })).id); break; }
      catch (e) {
        if (t >= 10) throw e;
        console.log(`  묶음 ${i + 1}/${parts.length} 제출 실패(${(e as Error).message}) → 다시 ${t}`);
        await sleep(3000 * t);
      }
    }
    writeFileSync(f, JSON.stringify({ ids, n: reqs.length, at: new Date().toISOString() }));
  }
  console.log(`[batch ${name}] 묶음 ${ids.length}개 (${reqs.length}건)`);
  for (;;) {
    const bs = await Promise.all(ids.map(id => client.messages.batches.retrieve(id)));
    const left = bs.filter(b => b.processing_status !== 'ended').length;
    const sum = bs.reduce((a, b) => { for (const [k, v] of Object.entries(b.request_counts)) a[k] = (a[k] ?? 0) + v; return a; }, {} as Record<string, number>);
    console.log(`  ${left ? `진행 중(남은 묶음 ${left})` : '끝'} ${JSON.stringify(sum)}`);
    if (!left) break;
    await sleep(60_000);
  }
  const out = new Map<string, string>();
  for (const id of ids)
    for await (const r of await client.messages.batches.results(id)) {
      if (r.result.type !== 'succeeded') { console.log(`  ${r.custom_id}: ${r.result.type}`); continue; }
      const m = r.result.message;
      if (m.stop_reason === 'refusal') { console.log(`  ${r.custom_id}: refusal`); continue; }
      out.set(r.custom_id, m.content.filter((c: any) => c.type === 'text').map((c: any) => c.text).join(''));
    }
  return out;
}

function parseJson(text: string): any {
  const m = text.match(/\{[\s\S]*\}/);
  return m ? JSON.parse(m[0]) : null;
}

async function collect(from: string, to: string) {
  const candFile = `${CACHE}/candidates-${from}-${to}.json`;
  mkdirSync(CACHE, { recursive: true });
  let cands: Cand[] = existsSync(candFile) ? JSON.parse(readFileSync(candFile, 'utf8')) : [];
  if (!cands.length) {
    for (const day of days(from, to)) {
      const wd = new Date(day + 'T00:00:00Z').getUTCDay();
      const ax = wd === 0 || wd === 6 ? [] : await arxivDay(day);
      if (ax.length) await sleep(3500);
      const hf = await hfDay(day);
      const hn = await hnDay(day);
      console.log(`${day} arXiv ${ax.length} · HF ${hf.length} · HN ${hn.length}`);
      cands.push(...ax, ...hf.filter(h => !ax.some(a => a.id === h.id)), ...hn);
    }
    writeFileSync(candFile, JSON.stringify(cands));
  }
  const existing = new Set((await db.select({ id: papers.id }).from(papers)).map(r => r.id));
  const seen = new Set<string>();
  cands = cands.filter(c => !existing.has(c.id) && !seen.has(c.id) && seen.add(c.id) && (c.kind !== 'hn' || AI_RE.test(c.title)));
  console.log(`후보 ${cands.length}건 (DB에 있는 것 제외)`);

  // HN은 제목만으로는 판단이 안 된다 → 본문 앞부분을 넣어 스크리닝한다(캐시)
  const prevFile = `${CACHE}/hn-preview-${from}-${to}.json`;
  const preview: Record<string, string> = existsSync(prevFile) ? JSON.parse(readFileSync(prevFile, 'utf8')) : {};
  const need = cands.filter(c => c.kind === 'hn' && !(c.id in preview)) as Extract<Cand, { kind: 'hn' }>[];
  for (let i = 0; i < need.length; i += 10) {
    await Promise.all(need.slice(i, i + 10).map(async c => {
      preview[c.id] = c.url ? (await fetchContent(c.url, 2000).catch(() => '')) : '';
    }));
    if (i % 200 === 0) { console.log(`  HN 본문 ${i}/${need.length}`); writeFileSync(prevFile, JSON.stringify(preview)); }
  }
  writeFileSync(prevFile, JSON.stringify(preview));

  const toScreen = cands.filter(c => !(c.kind === 'hn' && c.points >= 500));
  const reqs = toScreen.map((c, i) => ({
    custom_id: `s${i}`,
    params: {
      model: SCREEN_MODEL, max_tokens: 4096,
      output_config: { effort: 'low', format: { type: 'json_schema', schema: SCREEN_SCHEMA } },
      messages: [{ role: 'user', content: (c.kind === 'hn' ? HN_SCREEN : PAPER_SCREEN)
        .replace('{title}', c.title)
        .replace('{abstract}', c.kind === 'hn' ? (preview[c.id] || `(본문 없음 — Ask/Show HN이거나 못 가져옴) ${c.title}`) : c.abstract) }],
    },
  }));
  const res = new Map<string, string>();
  for (const [k, v] of await runBatch(`screen3-${from}-${to}`, reqs)) res.set(k, v);
  const score = new Map<string, number>();
  toScreen.forEach((c, i) => {
    try {
      const j = parseJson(res.get(`s${i}`) ?? '');
      if (j?.pass) score.set(c.id, j.score ?? 5);
    } catch { /* 파싱 실패 = 탈락 */ }
  });
  for (const c of cands) if (c.kind === 'hn' && c.points >= 500) score.set(c.id, 8);

  let saved = 0;
  for (const day of days(from, to)) {
    const pick = (kinds: string[], min: number, max: number) => cands
      .filter(c => c.day === day && kinds.includes(c.kind) && (score.get(c.id) ?? 0) >= min)
      .sort((a, b) => score.get(b.id)! - score.get(a.id)!).slice(0, max);
    const chosen = [...pick(['arxiv', 'hf'], 7, 2), ...pick(['hn'], 6, 10)];
    for (const c of chosen) {
      const now = new Date().toISOString();
      if (c.kind === 'hn') {
        const hot = Math.min(Math.floor(c.points / 5), 100);
        await db.insert(papers).values({
          id: c.id, title: c.title, abstract: c.title, authors: JSON.stringify([c.by]),
          categories: JSON.stringify(['hacker_news']), primaryCategory: 'hacker_news',
          publishedAt: new Date(c.time * 1000).toISOString(),
          arxivUrl: c.url ?? `https://news.ycombinator.com/item?id=${c.id.slice(3)}`, pdfUrl: '',
          source: 'hacker_news', hotScore: hot, isHot: hot >= 70, collectedAt: now,
        }).onConflictDoNothing();
      } else {
        const base = {
          id: c.id, title: c.title, abstract: c.abstract, authors: c.authors, categories: c.categories,
          primaryCategory: c.primaryCategory, publishedAt: c.publishedAt, updatedAt: c.updatedAt ?? c.publishedAt,
          arxivUrl: `https://arxiv.org/abs/${c.id}`, pdfUrl: `https://arxiv.org/pdf/${c.id}`,
        };
        const hot = c.kind === 'arxiv' ? calculateHotScore(base as any) : Math.min(score.get(c.id)! * 10, 100);
        await db.insert(papers).values({
          ...base, authors: JSON.stringify(c.authors), categories: JSON.stringify(c.categories),
          source: c.kind === 'hf' ? 'hugging_face' : 'arxiv', hotScore: hot, isHot: hot >= 70, collectedAt: now,
        } as any).onConflictDoNothing();
      }
      saved++;
    }
    console.log(`${day}: ${chosen.length}건 저장`);
  }
  console.log(`✅ collect 저장 ${saved}건`);
}

// v2 재요약: DB 글 전부(예전 글 포함)를 한·영 동시·구조화 출력으로 다시 쓴다.
// - 끝난 id는 .cache/backfill/v2-done.json에 남겨 다시 돌리면 남은 것만 한다(수집 뒤 새 글도 같은 명령).
// - 예전 요약 칸은 덮어쓰기 전에 v2-backup.json에 한 번 백업한다.
// - Slack 드립·뉴스레터로 나가지 않게 slackNotifiedAt을 채우고, summarizedAt은 예전 값(새 글은 publishedAt)을 쓴다.
async function summarize() {
  const doneFile = `${CACHE}/v2-done.json`, backupFile = `${CACHE}/v2-backup.json`, promptDir = `${CACHE}/v2-prompts`;
  mkdirSync(promptDir, { recursive: true });
  const done = new Set<string>(existsSync(doneFile) ? JSON.parse(readFileSync(doneFile, 'utf8')) : []);
  const all = await db.select().from(papers);
  if (!existsSync(backupFile)) writeFileSync(backupFile, JSON.stringify(all));
  const items = all.filter(p => !done.has(p.id));
  console.log(`v2 요약 대상 ${items.length}건 (끝난 것 ${done.size}건), 원문 가져오는 중...`);

  const promptOf = async (p: typeof all[number]): Promise<string | null> => {
    const f = `${promptDir}/${p.id.replace(/[^\w.-]/g, '_')}.txt`;
    if (existsSync(f)) return readFileSync(f, 'utf8') || null;
    let text: string;
    if (p.source === 'hacker_news') {
      const content = await fetchContent(p.arxivUrl, 20000);
      const comments = await fetchHNComments(parseInt(p.id.slice(3)), 25).catch(() => [] as string[]);
      text = content.length < 150 && comments.length < 3 ? '' : COMMUNITY_PROMPT_V2.replace('{title}', p.title).replace('{url}', p.arxivUrl)
        .replace('{content}', content || '(원문 없음 - 댓글 참고)').replace('{comments}', comments.join('\n---\n') || '(댓글 없음)');
    } else if (p.source === 'reddit') {
      text = COMMUNITY_PROMPT_V2.replace('Hacker News', 'Reddit').replace('{title}', p.title).replace('{url}', p.arxivUrl)
        .replace('{content}', p.abstract).replace('{comments}', '(댓글 없음)');
    } else {
      const pdf = p.pdfUrl ? await fetchPdfText(p.pdfUrl) : '';
      text = PAPER_PROMPT_V2.replace('{title}', p.title).replace('{content}', pdf.length > 200 ? pdf : p.abstract);
    }
    writeFileSync(f, text);
    return text || null;
  };

  const prompts = new Map<string, string>();
  for (let i = 0; i < items.length; i += 8) {
    const got = await Promise.all(items.slice(i, i + 8).map(async p => [p, await promptOf(p)] as const));
    for (const [p, t] of got) {
      if (t) prompts.set(p.id, t);
      else if (!p.summarizedAt) { await db.delete(papers).where(eq(papers.id, p.id)); console.log(`  ⛔ ${p.id} 내용 부족, 삭제`); }
      else { done.add(p.id); console.log(`  - ${p.id} 원문 없음, 예전 요약 유지`); }
    }
    if (i % 80 === 0) console.log(`  원문 ${i}/${items.length}`);
  }

  // 전부 한 번에 runBatch에 넘긴다(안에서 작은 묶음으로 나눠 낸다). 이름이 같으면 이미 낸 배치를 다시 읽는다.
  const ids = [...prompts.keys()].sort();
  const byId = new Map(all.map(p => [p.id, p]));
  let ok = 0;
  for (let c = 0; c * 2000 < ids.length; c++) {
    const chunk = ids.slice(c * 2000, (c + 1) * 2000);
    const res = await runBatch(`v2b-${chunk[0].replace(/[^\w.-]/g, '_')}-${chunk.length}`, chunk.map((id, i) => ({
      custom_id: `p${i}`,
      params: { model: SUMMARY_MODEL, max_tokens: 16000, messages: [{ role: 'user', content: prompts.get(id)! }],
        output_config: { effort: 'medium', format: { type: 'json_schema', schema: SUMMARY_SCHEMA_V2 } } },
    })));
    for (let i = 0; i < chunk.length; i++) {
      const p = byId.get(chunk[i])!;
      let r: any;
      try { r = JSON.parse(res.get(`p${i}`) ?? ''); } catch { r = null; }
      if (!r) { console.log(`  ❌ ${p.id} 결과 없음`); continue; }
      if (r.insufficientContent) {
        if (!p.summarizedAt) await db.delete(papers).where(eq(papers.id, p.id));
        done.add(p.id); continue;
      }
      await db.update(papers).set({
        ...toPaperRow(r),
        summarizedAt: p.summarizedAt ?? p.publishedAt,
        slackNotifiedAt: p.slackNotifiedAt ?? new Date().toISOString(),
      }).where(eq(papers.id, p.id));
      done.add(p.id); ok++;
    }
    writeFileSync(doneFile, JSON.stringify([...done]));
    console.log(`  배치 ${c + 1}: 누적 ${ok}건 저장`);
  }
  console.log(`✅ v2 summarize ${ok}/${ids.length}`);
}

const [cmd, ...rest] = process.argv.slice(2);
const arg = (k: string) => rest[rest.indexOf(k) + 1];
(cmd === 'collect' ? collect(arg('--from'), arg('--to')) : cmd === 'summarize' ? summarize() : Promise.reject(new Error('collect|summarize')))
  .then(() => process.exit(0))
  .catch(e => { console.error(e); process.exit(1); });
