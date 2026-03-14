import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { summarizeBatch } from '../src/lib/claude/client';
import { eq, isNull } from 'drizzle-orm';

async function main() {
  const unsummarized = await db.select()
    .from(papers)
    .where(isNull(papers.summarizedAt))
    .limit(200);

  console.log(`📝 ${unsummarized.length} papers to summarize`);
  if (unsummarized.length === 0) return;

  const results = await summarizeBatch(
    unsummarized.map(p => ({ id: p.id, title: p.title, abstract: p.abstract })),
    5
  );

  for (const [id, result] of results) {
    await db.update(papers)
      .set({
        titleKo: result.titleKo,
        summaryKo: result.summaryKo,
        aiCategory: result.aiCategory,
        devRelevance: result.devRelevance,
        summarizedAt: new Date().toISOString(),
      })
      .where(eq(papers.id, id));
  }

  console.log(`✅ Summarized ${results.size}/${unsummarized.length} papers`);
}

main().catch(console.error);
