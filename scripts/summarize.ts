import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { summarizePaper } from '../src/lib/claude/client';
import { toPaperRow } from '../src/lib/claude/prompts-v2';
import { and, eq, isNull, notInArray } from 'drizzle-orm';

// 논문(arXiv·HF·S2) 요약. HN·Reddit은 digest-community.ts가 맡는다.
async function main() {
  const unsummarized = await db.select()
    .from(papers)
    .where(and(isNull(papers.summarizedAt), notInArray(papers.source, ['hacker_news', 'reddit'])))
    .limit(2);

  console.log(`📝 ${unsummarized.length} papers to summarize`);
  if (unsummarized.length === 0) return;

  let done = 0;
  let failed = 0;
  for (const p of unsummarized) {
    try {
      const result = await summarizePaper(p.title, p.abstract, p.pdfUrl || undefined);
      if (result.insufficientContent) {
        await db.delete(papers).where(eq(papers.id, p.id));
        console.log(`  ⛔ [insufficient] ${p.id} — 내용 부족, 삭제`);
        continue;
      }
      await db.update(papers)
        .set({ ...toPaperRow(result), summarizedAt: new Date().toISOString() })
        .where(eq(papers.id, p.id));
      done++;
      console.log(`[${done}/${unsummarized.length}] ✅ ${p.title?.slice(0, 60)}`);
    } catch (e) {
      console.error(`❌ ${p.id}:`, e);
      failed++;
    }
  }

  console.log(`✅ Done ${done}/${unsummarized.length} (failed: ${failed})`);
  if (failed) process.exitCode = 1;
}

main().catch(e => { console.error(e); process.exit(1); });
