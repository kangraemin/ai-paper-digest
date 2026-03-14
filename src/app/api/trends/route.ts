import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const period = searchParams.get('period') || 'weekly';
  const days = period === 'monthly' ? 30 : 7;

  const trendData = await db.select({
    category: papers.aiCategory,
    count: sql<number>`count(*)`,
  })
    .from(papers)
    .where(sql`${papers.publishedAt} >= date('now', '-${sql.raw(String(days))} days')`)
    .groupBy(papers.aiCategory);

  return NextResponse.json({ period, data: trendData });
}
