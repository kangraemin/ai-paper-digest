import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchPopularPapers } from '../src/lib/semantic-scholar/client';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔥 Fetching popular papers from Semantic Scholar...');
  const popular = await fetchPopularPapers(5);
  console.log(`Found ${popular.length} popular papers`);

  let newCount = 0;
  for (const paper of popular) {
    const arxivId = paper.externalIds?.ArXiv;
    const id = arxivId ?? paper.paperId;

    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) {
      await db.update(papers).set({ citationCount: paper.citationCount }).where(eq(papers.id, id));
      continue;
    }

    await db.insert(papers).values({
      id,
      title: paper.title,
      abstract: paper.abstract ?? '',
      authors: JSON.stringify(paper.authors.map(a => a.name)),
      categories: JSON.stringify(paper.fieldsOfStudy ?? []),
      primaryCategory: paper.fieldsOfStudy?.[0] ?? 'other',
      publishedAt: `${paper.year}-01-01T00:00:00Z`,
      arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : `https://www.semanticscholar.org/paper/${paper.paperId}`,
      pdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : '',
      source: 'semantic_scholar',
      citationCount: paper.citationCount,
      hotScore: 80,
      isHot: true,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ Popular: ${popular.length} papers, ${newCount} new`);
}

main().catch(console.error);
