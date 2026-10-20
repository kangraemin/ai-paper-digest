/**
 * try-prompt-v2.ts — v2 요약 프롬프트를 몇 건에 시험하고, 예전 요약과 나란히 .cache/prompt-v2/compare.md로 쓴다(DB는 안 바꾼다).
 *   npx tsx scripts/try-prompt-v2.ts <id> [<id> ...]
 */
import Anthropic from '@anthropic-ai/sdk';
import { mkdirSync, writeFileSync } from 'fs';
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { inArray } from 'drizzle-orm';
import { fetchPdfText } from '../src/lib/pdf-fetcher';
import { fetchContent } from '../src/lib/content-fetcher';
import { fetchHNComments } from '../src/lib/hacker-news/client';
import { PAPER_PROMPT_V2, COMMUNITY_PROMPT_V2, SUMMARY_SCHEMA_V2 } from '../src/lib/claude/prompts-v2';

const client = new Anthropic();
const OUT = '.cache/prompt-v2';

export async function buildPrompt(p: typeof papers.$inferSelect): Promise<string> {
  if (p.source === 'hacker_news') {
    const content = (await fetchContent(p.arxivUrl, 20000)) || '(원문 없음)';
    const comments = await fetchHNComments(parseInt(p.id.slice(3)), 25);
    return COMMUNITY_PROMPT_V2.replace('{title}', p.title).replace('{url}', p.arxivUrl)
      .replace('{content}', content).replace('{comments}', comments.join('\n---\n') || '(댓글 없음)');
  }
  const pdf = p.pdfUrl ? await fetchPdfText(p.pdfUrl) : '';
  return PAPER_PROMPT_V2.replace('{title}', p.title).replace('{content}', pdf.length > 200 ? pdf : p.abstract);
}

const show = (v: string | null) => {
  if (!v) return '(비어 있음)';
  try { const x = JSON.parse(v); return Array.isArray(x) ? x.map((s: any) => `- ${typeof s === 'string' ? s : `${s.term}: ${s.definition}`}`).join('\n') : typeof x === 'object' ? Object.entries(x).map(([k, d]) => `- ${k}: ${d}`).join('\n') : String(x); } catch { return v; }
};
const showNew = (v: any) => Array.isArray(v) ? v.map(s => `- ${typeof s === 'string' ? s : `${s.term}: ${s.definition}`}`).join('\n') || '(없음)' : String(v ?? '');

async function main() {
  mkdirSync(OUT, { recursive: true });
  const rows = await db.select().from(papers).where(inArray(papers.id, process.argv.slice(2)));
  let md = '# v2 프롬프트 시험 — 예전 vs 새 요약\n';
  for (const p of rows) {
    const text = await buildPrompt(p);
    const res: any = await client.messages.create({
      model: 'claude-sonnet-5-5', max_tokens: 16000, messages: [{ role: 'user', content: text }],
      ...({ output_config: { effort: 'medium', format: { type: 'json_schema', schema: SUMMARY_SCHEMA_V2 } } } as any),
    } as any);
    const out = res.content.find((b: any) => b.type === 'text')?.text ?? '';
    writeFileSync(`${OUT}/${p.id.replace(/[^\w.-]/g, '_')}.json`, out);
    const r = JSON.parse(out);
    console.log(`${p.id} in=${res.usage.input_tokens} out=${res.usage.output_tokens} stop=${res.stop_reason}`);
    md += `\n---\n## ${p.source} · ${p.title}\n${p.arxivUrl}\n\n`;
    for (const [label, oldV, newV] of [
      ['한줄요약', p.oneLiner, r.oneLiner], ['누가 읽나', p.targetAudience, r.targetAudience],
      ['핵심', show(p.keyFindings), showNew(r.keyFindings)], ['근거', show(p.evidence), showNew(r.evidence)],
      ['적용(액션)', show(p.howToApply), showNew(r.howToApply)],
    ] as const) md += `### ${label}\n**예전**\n${oldV ?? '(비어 있음)'}\n\n**새**\n${newV}\n\n`;
    md += `### 해보기(복사용)\n**예전**\n\`\`\`\n${p.codeExample || '(비어 있음)'}\n\`\`\`\n**새**\n\`\`\`\n${r.codeExample || '(비어 있음)'}\n\`\`\`\n`;
    md += `### 영어판(새)\n${r.oneLinerEn}\n\n${showNew(r.howToApplyEn)}\n\n점수 예전 ${p.devRelevance} → 새 ${r.devRelevance}\n`;
  }
  writeFileSync(`${OUT}/compare.md`, md);
  console.log(`→ ${OUT}/compare.md`);
}
if (require.main === module) main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); });
