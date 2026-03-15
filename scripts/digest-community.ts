import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, isNull, and } from 'drizzle-orm';
import { fetchContent } from '../src/lib/content-fetcher';
import { fetchHNComments } from '../src/lib/hacker-news/client';
import { COMMUNITY_DIGEST_PROMPT } from '../src/lib/claude/community-prompts';
import { runClaude } from '../src/lib/claude/runner';

function extractJson(text: string): string {
  if (text.includes('```')) {
    let inner = text.split('```')[1];
    if (inner.startsWith('json')) inner = inner.slice(4);
    return inner.trim();
  }
  const match = text.match(/\{[\s\S]*\}/);
  return match ? match[0] : text;
}

export async function digestCommunity(): Promise<number> {
  console.log('📰 Digesting community content...');

  const items = await db.select().from(papers)
    .where(and(eq(papers.source, 'hacker_news'), isNull(papers.summarizedAt)))
    .limit(10);

  console.log(`Found ${items.length} undigested community items`);

  let successCount = 0;
  for (const item of items) {
    try {
      console.log(`\n📄 ${item.title}`);

      // 1. 원문 크롤링
      const content = await fetchContent(item.arxivUrl);
      console.log(`  원문: ${content.length}자`);

      // 2. HN 댓글 수집
      const hnId = parseInt(item.id.replace('hn_', ''));
      const comments = await fetchHNComments(hnId, 15);
      console.log(`  댓글: ${comments.length}개`);

      // 3. claude -p로 정리
      const prompt = COMMUNITY_DIGEST_PROMPT
        .replace('{title}', item.title)
        .replace('{url}', item.arxivUrl)
        .replace('{content}', content || '(원문을 가져올 수 없습니다)')
        .replace('{comments}', comments.length > 0 ? comments.join('\n---\n') : '(댓글 없음)');

      console.log('  🤖 정리 중...');
      const raw = await runClaude(prompt, { model: 'sonnet', timeout: 120000 });
      const result = JSON.parse(extractJson(raw));

      // 4. DB 업데이트
      await db.update(papers).set({
        titleKo: result.titleKo,
        oneLiner: result.oneLiner,
        targetAudience: result.targetAudience,
        keyFindings: JSON.stringify(result.keyFindings),
        evidence: JSON.stringify(result.evidence),
        howToApply: JSON.stringify(result.howToApply),
        codeExample: result.codeExample || '',
        relatedResources: JSON.stringify(result.relatedResources || []),
        glossary: JSON.stringify(result.glossary || {}),
        tags: JSON.stringify(result.tags || []),
        aiCategory: result.aiCategory,
        devRelevance: result.devRelevance,
        summarizedAt: new Date().toISOString(),
      }).where(eq(papers.id, item.id));

      successCount++;
      console.log(`  ✅ 완료`);
    } catch (err) {
      console.error(`  ❌ 실패: ${item.id}`, (err as Error).message);
    }
  }

  console.log(`\n✅ Digested ${successCount}/${items.length} community items`);
  return successCount;
}

digestCommunity().catch(console.error);
