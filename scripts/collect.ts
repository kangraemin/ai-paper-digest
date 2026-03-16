import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchRecentPapers } from '../src/lib/arxiv/client';
import { calculateHotScore } from '../src/lib/hot-scorer';
import { screenBatch } from '../src/lib/claude/screener';

async function main() {
  console.log('📄 Fetching papers from arXiv...');
  const fetched = await fetchRecentPapers(100);
  console.log(`Found ${fetched.length} papers`);

  console.log('🔍 Screening papers...');
  const screenResults = await screenBatch(
    fetched.map(p => ({ id: p.id, title: p.title, abstract: p.abstract }))
  );
  const passed = fetched
    .filter(p => screenResults.get(p.id)?.pass)
    .sort((a, b) => (screenResults.get(b.id)?.score ?? 0) - (screenResults.get(a.id)?.score ?? 0))
    .slice(0, 3);
  console.log(`[스크리닝] ${fetched.length}편 중 ${passed.length}편 통과 (상위 3개)`);

  let newCount = 0;
  for (const paper of passed) {
    const hotScore = calculateHotScore(paper);
    await db.insert(papers).values({
      ...paper,
      authors: JSON.stringify(paper.authors),
      categories: JSON.stringify(paper.categories),
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ Collected ${passed.length} papers, ${newCount} new`);
}

main().catch(console.error);
