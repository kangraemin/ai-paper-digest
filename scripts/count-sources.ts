import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, not, sql, isNull, isNotNull } from 'drizzle-orm';
async function main() {
  const hn = await db.select({ count: sql<number>`count(*)` }).from(papers).where(eq(papers.source, 'hacker_news'));
  const s2 = await db.select({ count: sql<number>`count(*)` }).from(papers).where(not(eq(papers.source, 'hacker_news')));
  const hnSummarized = await db.select({ count: sql<number>`count(*)` }).from(papers).where(sql`source = 'hacker_news' AND summarized_at IS NOT NULL`);
  const s2Summarized = await db.select({ count: sql<number>`count(*)` }).from(papers).where(sql`source != 'hacker_news' AND summarized_at IS NOT NULL`);
  console.log('HN:', hn[0].count, '편 (요약됨:', hnSummarized[0].count + ')');
  console.log('논문(S2):', s2[0].count, '편 (요약됨:', s2Summarized[0].count + ')');
}
main();
