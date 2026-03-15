import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, not, and, gte, lt, sql, isNotNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const conditions = [];
  conditions.push(isNotNull(papers.summarizedAt));

  if (source === 'community') {
    conditions.push(eq(papers.source, 'hacker_news'));
  } else if (source === 'papers') {
    conditions.push(not(eq(papers.source, 'hacker_news')));
  }

  if (date) {
    const nextDate = new Date(date + 'T00:00:00Z');
    nextDate.setDate(nextDate.getDate() + 1);
    conditions.push(gte(papers.publishedAt, date + 'T00:00:00Z'));
    conditions.push(lt(papers.publishedAt, nextDate.toISOString()));
  }

  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [results, countResult] = await Promise.all([
    db.select({
      id: papers.id,
      title: papers.title,
      titleKo: papers.titleKo,
      oneLiner: papers.oneLiner,
      aiCategory: papers.aiCategory,
      devRelevance: papers.devRelevance,
      targetAudience: papers.targetAudience,
      tags: papers.tags,
      source: papers.source,
      isHot: papers.isHot,
      publishedAt: papers.publishedAt,
      authors: papers.authors,
    })
      .from(papers)
      .where(where)
      .orderBy(desc(papers.publishedAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(papers)
      .where(where),
  ]);

  const total = countResult[0].count;

  return NextResponse.json(
    { papers: results, total, page, limit, hasMore: page * limit < total },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
