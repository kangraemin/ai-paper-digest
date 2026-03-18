import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchPopularPapers } from '../src/lib/semantic-scholar/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔥 Fetching popular papers from Semantic Scholar...');
  const popular = await fetchPopularPapers(5);
  console.log(`Found ${popular.length} popular papers`);

  console.log('🔍 Screening papers...');
  const screenResults = await screenBatch(
    popular.map(p => ({
      id: p.externalIds?.ArXiv ?? p.paperId,
      title: p.title,
      abstract: p.abstract ?? p.title,
    }))
  );
  const passed = popular
    .filter(p => {
      const id = p.externalIds?.ArXiv ?? p.paperId;
      return screenResults.get(id)?.pass;
    })
    .slice(0, 3);
  console.log(`[스크리닝] ${popular.length}편 중 ${passed.length}편 통과 (상위 3개)`);

  let newCount = 0;
  for (const paper of passed) {
    const arxivId = paper.externalIds?.ArXiv;
    const id = arxivId ?? paper.paperId;

    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) {
      const updateFields: Record<string, unknown> = { citationCount: paper.citationCount };
      if (paper.publicationDate) updateFields.publishedAt = `${paper.publicationDate}T00:00:00Z`;
      await db.update(papers).set(updateFields).where(eq(papers.id, id));
      continue;
    }

    await db.insert(papers).values({
      id,
      title: paper.title,
      abstract: paper.abstract ?? '',
      authors: JSON.stringify(paper.authors.map(a => a.name)),
      categories: JSON.stringify(paper.fieldsOfStudy ?? []),
      primaryCategory: paper.fieldsOfStudy?.[0] ?? 'other',
      publishedAt: paper.publicationDate
        ? `${paper.publicationDate}T00:00:00Z`
        : `${paper.year}-01-01T00:00:00Z`,
      arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : `https://www.semanticscholar.org/paper/${paper.paperId}`,
      pdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : '',
      source: 'semantic_scholar',
      citationCount: paper.citationCount,
      venue: paper.venue ?? null,
      affiliations: JSON.stringify([...new Set(paper.authors.flatMap(a => a.affiliations ?? []))]),
      hotScore: 80,
      isHot: true,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ Popular: ${passed.length} papers, ${newCount} new`);
}

main().catch(console.error);
