import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { isNull, notInArray, and } from 'drizzle-orm';

async function main() {
  const rows = await db.select().from(papers)
    .where(and(isNull(papers.summarizedAt), notInArray(papers.source, ['hacker_news', 'reddit'])))
    .limit(200);

  const bySource: Record<string, number> = {};
  for (const r of rows) {
    const s = r.source || 'unknown';
    bySource[s] = (bySource[s] || 0) + 1;
  }
  console.log('요약 대기 (summarizedAt IS NULL):', rows.length, '개');
  for (const [src, cnt] of Object.entries(bySource)) {
    console.log(` ${src}: ${cnt}개`);
  }
}
main().catch(console.error);
