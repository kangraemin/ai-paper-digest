import { db } from './index';
import { papers } from './schema';
import { desc, like, or, and, sql, isNotNull, ne, eq } from 'drizzle-orm';
import type { Lang } from '@/lib/i18n';

function escapePattern(word: string): string {
  return '%' + word.replace(/%/g, '\\%').replace(/_/g, '\\_') + '%';
}

function wordCondition(word: string) {
  const pattern = escapePattern(word);
  return or(
    like(papers.title, pattern),
    like(papers.titleKo, pattern),
    like(papers.abstract, pattern),
    like(papers.tags, pattern),
    like(papers.tagsEn, pattern),
    like(papers.summaryKo, pattern),
    like(papers.oneLiner, pattern),
    like(papers.oneLinerEn, pattern),
    like(papers.keyFindings, pattern),
    like(papers.keyFindingsEn, pattern),
  );
}

export async function searchPapers(
  query: string,
  limit = 20,
  offset = 0,
  lang: Lang = 'ko',
) {
  const words = query.trim().split(/\s+/).filter(w => w.length > 0);
  if (words.length === 0) return { results: [], total: 0 };

  const wordConditions = words.map(wordCondition);
  const searchCondition = and(isNotNull(papers.summarizedAt), ...wordConditions);

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

export async function getRelatedPapers(
  paperId: string,
  aiCategory: string | null,
  limit = 8,
) {
  if (!aiCategory) return [];
  return db.select({
    id: papers.id,
    title: papers.title,
    titleKo: papers.titleKo,
    oneLiner: papers.oneLiner,
    oneLinerEn: papers.oneLinerEn,
    publishedAt: papers.publishedAt,
    aiCategory: papers.aiCategory,
    source: papers.source,
  })
    .from(papers)
    .where(and(
      isNotNull(papers.summarizedAt),
      eq(papers.aiCategory, aiCategory),
      ne(papers.id, paperId),
    ))
    .orderBy(desc(papers.publishedAt))
    .limit(limit);
}
