import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { isNotNull } from 'drizzle-orm';

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = await db.select().from(papers).where(isNotNull(papers.summarizedAt));
  const todayRows = rows.filter(r => r.summarizedAt && r.summarizedAt >= today.toISOString());
  
  const bySource: Record<string, number> = {};
  for (const r of todayRows) {
    const s = r.source || 'unknown';
    bySource[s] = (bySource[s] || 0) + 1;
  }
  console.log('오늘 요약 총:', todayRows.length, '개');
  for (const [src, cnt] of Object.entries(bySource)) {
    console.log(` ${src}: ${cnt}개`);
  }
}
main().catch(console.error);
