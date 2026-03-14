import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchRecentPapers } from '../src/lib/arxiv/client';
import { calculateHotScore } from '../src/lib/hot-scorer';

async function main() {
  console.log('📄 Fetching papers from arXiv...');
  const fetched = await fetchRecentPapers(100);
  console.log(`Found ${fetched.length} papers`);

  let newCount = 0;
  for (const paper of fetched) {
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

  console.log(`✅ Collected ${fetched.length} papers, ${newCount} new`);
}

main().catch(console.error);
