import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { summarizePaper } from '../src/lib/claude/client';
import { eq, isNull } from 'drizzle-orm';

async function main() {
  const unsummarized = await db.select()
    .from(papers)
    .where(isNull(papers.summarizedAt))
    .limit(3);

  console.log(`📝 ${unsummarized.length} papers to summarize`);
  if (unsummarized.length === 0) return;

  let done = 0;
  for (const p of unsummarized) {
    try {
      const result = await summarizePaper(p.title, p.abstract, p.pdfUrl ?? undefined);
      await db.update(papers)
        .set({
          titleKo: result.titleKo,
          oneLiner: result.oneLiner,
          targetAudience: result.targetAudience,
          keyFindings: JSON.stringify(result.keyFindings),
          evidence: JSON.stringify(result.evidence),
          howToApply: JSON.stringify(result.howToApply),
          codeExample: result.codeExample,
          relatedResources: JSON.stringify(result.relatedResources),
          glossary: JSON.stringify(result.glossary),
          tags: JSON.stringify(result.tags),
          aiCategory: result.aiCategory,
          devRelevance: result.devRelevance,
          summarizedAt: new Date().toISOString(),
        })
        .where(eq(papers.id, p.id));
      done++;
      console.log(`[${done}/${unsummarized.length}] ✅ ${p.title?.slice(0, 60)}`);
    } catch (e) {
      console.error(`❌ ${p.id}:`, e);
    }
  }

  console.log(`✅ Done ${done}/${unsummarized.length}`);
}

main().catch(console.error);
