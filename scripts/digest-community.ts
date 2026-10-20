import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, inArray, isNull, and } from 'drizzle-orm';
import { fetchContent } from '../src/lib/content-fetcher';
import { fetchHNComments } from '../src/lib/hacker-news/client';
import { fetchRedditComments } from '../src/lib/reddit/client';
import { COMMUNITY_PROMPT_V2, toPaperRow } from '../src/lib/claude/prompts-v2';
import { summarizeV2 } from '../src/lib/claude/client';

export async function digestCommunity(): Promise<number> {
  console.log('📰 Digesting community content...');

  const items = await db.select().from(papers)
    .where(and(inArray(papers.source, ['hacker_news', 'reddit']), isNull(papers.summarizedAt)))
    .limit(10);

  console.log(`Found ${items.length} undigested community items`);

  let successCount = 0;
  let failCount = 0;
  for (const item of items) {
    try {
      console.log(`\n📄 ${item.title}`);

      // 1. 원문 크롤링
      let content = '';
      if (item.source === 'reddit') {
        // Reddit JSON API로 본문 가져오기
        try {
          const jsonUrl = item.arxivUrl.replace(/\/$/, '') + '.json';
          const res = await fetch(jsonUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' } });
          if (res.ok) {
            const data = await res.json();
            const post = data[0]?.data?.children?.[0]?.data;
            content = post?.selftext || post?.title || '';
          }
        } catch (e) {
          console.warn(`  [Reddit JSON API] ${item.id}: ${(e as Error).message}`);
        }
        if (!content) content = await fetchContent(item.arxivUrl);
      } else {
        content = await fetchContent(item.arxivUrl, 20000);
      }
      console.log(`  원문: ${content.length}자`);

      // 2. 댓글 수집 (HN만)
      let comments: string[] = [];
      if (item.source === 'hacker_news') {
        const hnId = parseInt(item.id.replace('hn_', ''));
        comments = await fetchHNComments(hnId, 25).catch(() => [] as string[]);
        console.log(`  댓글: ${comments.length}개`);
      } else if (item.source === 'reddit') {
        comments = await fetchRedditComments(item.arxivUrl.replace('https://www.reddit.com', ''), 15);
        console.log(`  댓글: ${comments.length}개`);
      }

      // 내용 유효성 검사: 내용과 댓글 모두 부족하면 삭제
      const hasContent = content.length >= 150;
      const hasComments = comments.length >= 3;
      if (!hasContent && !hasComments) {
        console.log(`  ⛔ [insufficient] ${item.id} — 내용(${content.length}자) + 댓글(${comments.length}개) 부족, 삭제`);
        await db.delete(papers).where(eq(papers.id, item.id));
        continue;
      }

      // 3. v2 프롬프트로 한·영 동시 정리(구조화 출력)
      const template = item.source === 'reddit' ? COMMUNITY_PROMPT_V2.replace('Hacker News', 'Reddit') : COMMUNITY_PROMPT_V2;
      const prompt = template
        .replace('{title}', item.title)
        .replace('{url}', item.arxivUrl)
        .replace('{content}', content || '(원문 없음 - 댓글 참고)')
        .replace('{comments}', comments.length > 0 ? comments.join('\n---\n') : '(댓글 없음)');

      console.log('  🤖 정리 중...');
      const result = await summarizeV2(prompt);

      if (result.insufficientContent) {
        console.log(`  ⛔ [insufficient] ${item.id} — Claude 내용 부족 감지, 삭제`);
        await db.delete(papers).where(eq(papers.id, item.id));
        continue;
      }

      // 4. DB 업데이트
      await db.update(papers).set({ ...toPaperRow(result), summarizedAt: new Date().toISOString() })
        .where(eq(papers.id, item.id));

      successCount++;
      console.log(`  ✅ 완료`);
    } catch (err) {
      console.error(`  ❌ 실패: ${item.id}`, (err as Error).message);
      failCount++;
    }
  }

  console.log(`\n✅ Digested ${successCount}/${items.length} community items`);
  if (failCount) process.exitCode = 1;
  return successCount;
}

digestCommunity().catch(e => { console.error(e); process.exit(1); });
