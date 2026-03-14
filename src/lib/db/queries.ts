import { db } from './index';
import { papers } from './schema';
import { desc, like, or, and, sql, isNotNull } from 'drizzle-orm';

export async function searchPapers(query: string, limit = 20, offset = 0) {
  const pattern = `%${query}%`;

  const searchCondition = and(
    isNotNull(papers.summarizedAt),
    or(
      like(papers.title, pattern),
      like(papers.titleKo, pattern),
      like(papers.summaryKo, pattern),
      like(papers.abstract, pattern),
      like(papers.keyFindings, pattern),
    )
  );

  const results = await db.select()
    .from(papers)
    .where(searchCondition)
    .orderBy(desc(papers.publishedAt))
    .limit(limit)
    .offset(offset);

  const countResult = await db.select({ count: sql<number>`count(*)` })
    .from(papers)
    .where(searchCondition);

  return { results, total: countResult[0].count };
}
