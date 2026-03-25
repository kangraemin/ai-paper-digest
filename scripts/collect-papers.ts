import { db } from '../src/lib/db';
import { papers, screenedItems } from '../src/lib/db/schema';
import { fetchRecentPapers } from '../src/lib/arxiv/client';
import { calculateHotScore } from '../src/lib/hot-scorer';
import { screenBatch } from '../src/lib/claude/screener';
import { eq, inArray, sql } from 'drizzle-orm';

const HF_API = 'https://huggingface.co/api/papers?limit=40';
const MIN_SCORE = 7;
const MAX_PAPERS = 3;

interface HfPaper {
  id: string;
  title: string;
  summary: string;
  authors: { name: string }[];
  publishedAt: string;
  upvotes: number;
}

type ScoredArxiv = { source: 'arxiv'; paper: Awaited<ReturnType<typeof fetchRecentPapers>>[0]; score: number };
type ScoredHf = { source: 'hugging_face'; paper: HfPaper; score: number };
type Scored = ScoredArxiv | ScoredHf;

async function main() {
  // 15일 지난 스크리닝 캐시 정리
  await db.delete(screenedItems).where(sql`screened_at < datetime('now', '-15 days')`);

  // === arXiv ===
  console.log('📄 Fetching papers from arXiv...');
  const arxivFetched = await fetchRecentPapers(100);
  console.log(`arXiv: ${arxivFetched.length}개 fetch`);

  const newArxiv = [];
  for (const p of arxivFetched) {
    const existing = await db.select().from(papers).where(eq(papers.id, p.id)).limit(1);
    if (existing.length === 0) newArxiv.push(p);
  }
  console.log(`[중복제거] arXiv ${arxivFetched.length}개 중 ${newArxiv.length}개 신규`);

  // === HuggingFace ===
  console.log('📄 Fetching papers from HuggingFace...');
  const hfRes = await fetch(HF_API);
  if (!hfRes.ok) throw new Error(`HF API error: ${hfRes.status}`);
  const hfFetched: HfPaper[] = await hfRes.json();
  console.log(`HuggingFace: ${hfFetched.length}개 fetch`);

  const newHf = [];
  for (const p of hfFetched) {
    const existing = await db.select().from(papers).where(eq(papers.id, p.id)).limit(1);
    if (existing.length === 0) newHf.push(p);
  }
  console.log(`[중복제거] HuggingFace ${hfFetched.length}개 중 ${newHf.length}개 신규`);

  // === arXiv ↔ HF 중복 제거 ===
  const arxivIds = new Set(newArxiv.map(p => p.id));
  const dedupedHf = newHf.filter(p => !arxivIds.has(p.id));
  console.log(`[소스간중복제거] HuggingFace ${newHf.length}개 → ${dedupedHf.length}개`);

  // === 스크리닝 캐시 체크 ===
  const allCandidateIds = [...newArxiv.map(p => p.id), ...dedupedHf.map(p => p.id)];
  const cachedScreenings = allCandidateIds.length > 0
    ? await db.select().from(screenedItems).where(inArray(screenedItems.id, allCandidateIds))
    : [];
  const cachedIds = new Set(cachedScreenings.map(r => r.id));

  const toScreenArxiv = newArxiv.filter(p => !cachedIds.has(p.id));
  const toScreenHf = dedupedHf.filter(p => !cachedIds.has(p.id));
  console.log(`[스크리닝캐시] arXiv ${newArxiv.length}개 중 ${toScreenArxiv.length}개 신규 스크리닝`);
  console.log(`[스크리닝캐시] HF ${dedupedHf.length}개 중 ${toScreenHf.length}개 신규 스크리닝`);

  // === 스크리닝 ===
  console.log('🔍 Screening papers...');
  const [arxivResults, hfResults] = await Promise.all([
    screenBatch(toScreenArxiv.map(p => ({ id: p.id, title: p.title, abstract: p.abstract }))),
    screenBatch(toScreenHf.map(p => ({ id: p.id, title: p.title, abstract: p.summary ?? p.title }))),
  ]);

  // 스크리닝 결과 캐시 저장
  const now = new Date().toISOString();
  for (const [id, result] of arxivResults) {
    await db.insert(screenedItems).values({ id, pass: result.pass, score: result.score, screenedAt: now }).onConflictDoNothing();
  }
  for (const [id, result] of hfResults) {
    await db.insert(screenedItems).values({ id, pass: result.pass, score: result.score, screenedAt: now }).onConflictDoNothing();
  }

  // 캐시된 결과도 합산 (pass인 것만)
  for (const cached of cachedScreenings) {
    if (cached.pass) {
      arxivResults.set(cached.id, { pass: true, score: cached.score, reason: 'cached' });
      hfResults.set(cached.id, { pass: true, score: cached.score, reason: 'cached' });
    }
  }

  // === score ≥ MIN_SCORE 필터 + 합산 정렬 ===
  const candidates: Scored[] = [
    ...newArxiv
      .filter(p => (arxivResults.get(p.id)?.pass) && (arxivResults.get(p.id)?.score ?? 0) >= MIN_SCORE)
      .map(p => ({ source: 'arxiv' as const, paper: p, score: arxivResults.get(p.id)!.score })),
    ...dedupedHf
      .filter(p => (hfResults.get(p.id)?.pass) && (hfResults.get(p.id)?.score ?? 0) >= MIN_SCORE)
      .map(p => ({ source: 'hugging_face' as const, paper: p, score: hfResults.get(p.id)!.score })),
  ].sort((a, b) => b.score - a.score).slice(0, MAX_PAPERS);

  console.log(`[스크리닝] score≥${MIN_SCORE} 통과 후 top ${candidates.length}개 선택`);

  // === 저장 ===
  let saved = 0;
  for (const c of candidates) {
    if (c.source === 'arxiv') {
      const p = c.paper;
      const hotScore = calculateHotScore(p);
      await db.insert(papers).values({
        ...p,
        authors: JSON.stringify(p.authors),
        categories: JSON.stringify(p.categories),
        hotScore,
        isHot: hotScore >= 70,
        collectedAt: new Date().toISOString(),
      }).onConflictDoNothing();
    } else {
      const p = c.paper;
      const hotScore = Math.min(c.score * 10, 100);
      await db.insert(papers).values({
        id: p.id,
        title: p.title,
        abstract: p.summary ?? '',
        authors: JSON.stringify(p.authors.map(a => a.name)),
        categories: JSON.stringify([]),
        primaryCategory: 'cs.AI',
        publishedAt: p.publishedAt,
        arxivUrl: `https://arxiv.org/abs/${p.id}`,
        pdfUrl: `https://arxiv.org/pdf/${p.id}`,
        source: 'hugging_face',
        hotScore,
        isHot: hotScore >= 70,
        collectedAt: new Date().toISOString(),
      }).onConflictDoNothing();
    }
    saved++;
    console.log(`  ✅ [${c.source}] score=${c.score} ${c.source === 'arxiv' ? c.paper.title.slice(0, 60) : c.paper.title.slice(0, 60)}`);
  }

  console.log(`\n✅ Papers: ${saved}개 저장`);
}

main().catch(console.error);
