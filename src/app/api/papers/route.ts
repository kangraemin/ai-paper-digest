import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, and, gte, lt, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const conditions = [];

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
    db.select()
      .from(papers)
      .where(where)
      .orderBy(desc(papers.publishedAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(papers)
      .where(where),
  ]);

  return NextResponse.json({
    papers: results,
    total: countResult[0].count,
    page,
    limit,
  });
}
