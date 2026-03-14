import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import { screenBatch } from '../src/lib/claude/screener';

async function main() {
  console.log('🧹 기존 논문 스크리닝 시작...');
  const allPapers = await db.select({
    id: papers.id,
    title: papers.title,
    abstract: papers.abstract,
  }).from(papers);

  console.log(`총 ${allPapers.length}편 검사`);

  const screenResults = await screenBatch(allPapers);

  let kept = 0;
  let removed = 0;
  for (const [id, result] of screenResults) {
    if (!result.pass) {
      await db.delete(papers).where(eq(papers.id, id));
      removed++;
    } else {
      kept++;
    }
  }

  console.log(`[정리] 총 ${allPapers.length}편 중 ${kept}편 유지, ${removed}편 삭제`);
}

main().catch(console.error);
