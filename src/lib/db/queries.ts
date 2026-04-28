import { db } from './index';
import { papers } from './schema';
import { desc, like, or, and, sql, isNotNull, ne, eq } from 'drizzle-orm';
import type { Lang } from '@/lib/i18n';

export async function searchPapers(
  query: string,
  limit = 20,
  offset = 0,
  lang: Lang = 'ko',
) {
  const escaped = query.replace(/%/g, '\\%').replace(/_/g, '\\_');
  const pattern = `%${escaped}%`;

  const commonCols = [
    like(papers.title, pattern),
    like(papers.titleKo, pattern),
    like(papers.abstract, pattern),
    like(papers.tags, pattern),
    like(papers.tagsEn, pattern),
  ];
  const koCols = [
    like(papers.summaryKo, pattern),
    like(papers.oneLiner, pattern),
    like(papers.keyFindings, pattern),
  ];
  const enCols = [
    like(papers.oneLinerEn, pattern),
    like(papers.keyFindingsEn, pattern),
  ];
  const primary = lang === 'en' ? enCols : koCols;
  const secondary = lang === 'en' ? koCols : enCols;

  const searchCondition = and(
    isNotNull(papers.summarizedAt),
    or(...commonCols, ...primary, ...secondary),
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
