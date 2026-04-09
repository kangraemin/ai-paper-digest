import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { summarizePaper } from '../src/lib/claude/client';
import { eq, isNull } from 'drizzle-orm';
import { isRedditUIText } from '../src/lib/reddit/client';

async function main() {
  const unsummarized = await db.select()
    .from(papers)
    .where(isNull(papers.summarizedAt))
    .limit(2);

  console.log(`📝 ${unsummarized.length} papers to summarize`);
  if (unsummarized.length === 0) return;

  let done = 0;
  let failed = 0;
  for (const p of unsummarized) {
    try {
      let abstract = p.abstract;

      // 안전망: Reddit 글인데 내용이 부실하면 → fallback 체인
      const needsFallback = p.source === 'reddit' && (
        abstract.trim() === p.title.trim() ||
        abstract.trim().length < 150 ||
        isRedditUIText(abstract)
      );
      if (needsFallback) {
        const permalink = p.arxivUrl?.match(/reddit\.com(\/r\/[^?]+)/)?.[1];
        if (permalink) {
          const { fetchRedditPostContent, fetchRedditComments } = await import('../src/lib/reddit/client');

          // 본문: JSON API
          const body = await fetchRedditPostContent(permalink);

          // 댓글: JSON API
          const comments = await fetchRedditComments(permalink, 5);
          const commentText = comments.length > 0
            ? '\n\n[Top Comments]\n' + comments.join('\n\n')
            : '';

          const combined = ((body || '') + commentText).trim();

          if (combined.length > 50) {
            abstract = combined;
            await db.update(papers).set({ abstract: combined }).where(eq(papers.id, p.id));
            console.log(`  📥 [fallback OK] ${p.id} (body: ${(body||'').length}, comments: ${comments.length})`);
          } else {
            await db.delete(papers).where(eq(papers.id, p.id));
            console.log(`  🗑️ [skip] ${p.id} — no content, deleted`);
            continue;
          }
        }
      }

      const result = await summarizePaper(p.title, abstract, p.pdfUrl ?? undefined);
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
      failed++;
    }
  }

  console.log(`✅ Done ${done}/${unsummarized.length} (failed: ${failed})`);
}

main().catch(console.error);
