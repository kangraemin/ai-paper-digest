// 해보기(codeExample) 칸에 덩어리별 빈 줄을 넣는다(spaceOut). 여러 번 돌려도 결과가 같다.
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq } from 'drizzle-orm';
import { spaceOut } from '../src/lib/claude/prompts-v2';

async function main() {
  const rows = await db.select({ id: papers.id, ko: papers.codeExample, en: papers.codeExampleEn }).from(papers);
  let n = 0;
  for (const r of rows) {
    const ko = r.ko ? spaceOut(r.ko) : r.ko, en = r.en ? spaceOut(r.en) : r.en;
    if (ko === r.ko && en === r.en) continue;
    await db.update(papers).set({ codeExample: ko, codeExampleEn: en }).where(eq(papers.id, r.id));
    n++;
  }
  console.log(`✅ ${n}/${rows.length}건 띄움`);
}

main().catch(e => { console.error(e); process.exit(1); });
