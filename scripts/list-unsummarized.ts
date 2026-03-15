import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';

async function main() {
  const items = await db.select({ id: papers.id, title: papers.title }).from(papers)
    .where(and(eq(papers.source, 'hacker_news'), isNull(papers.summarizedAt)))
    .orderBy(papers.title);

  for (const item of items) {
    console.log(item.title);
  }
  console.log('---');
  console.log('총', items.length, '편');
}

main().catch(console.error);
