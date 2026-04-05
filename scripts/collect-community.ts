import { db } from '../src/lib/db';
import { papers, screenedItems } from '../src/lib/db/schema';
import { fetchHNTopAI } from '../src/lib/hacker-news/client';
import { fetchRedditAI } from '../src/lib/reddit/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq, inArray, sql } from 'drizzle-orm';

const MIN_SCORE = 6;
const MAX_POSTS = 10;

type ScoredHN = { source: 'hacker_news'; story: Awaited<ReturnType<typeof fetchHNTopAI>>[0]; id: string; score: number };
type ScoredReddit = { source: 'reddit'; post: Awaited<ReturnType<typeof fetchRedditAI>>[0]; id: string; score: number };
type Scored = ScoredHN | ScoredReddit;

async function main() {
  // 15일 지난 스크리닝 캐시 정리
  await db.delete(screenedItems).where(sql`screened_at < datetime('now', '-15 days')`);

  // === Hacker News ===
  console.log('📰 Fetching AI stories from Hacker News...');
  const stories = await fetchHNTopAI(100);
  console.log(`HN: ${stories.length}개 fetch`);

  const newStories = [];
  for (const s of stories) {
    const id = `hn_${s.id}`;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length === 0) newStories.push(s);
  }
  console.log(`[중복제거] HN ${stories.length}개 중 ${newStories.length}개 신규`);

  // === Reddit ===
  console.log('🔴 Fetching AI posts from Reddit...');
  const posts = await fetchRedditAI();
  console.log(`Reddit: ${posts.length}개 fetch`);

  const newPosts = [];
  for (const p of posts) {
    const id = `reddit_${p.subreddit}_${p.id}`;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length === 0) newPosts.push(p);
  }
  console.log(`[중복제거] Reddit ${posts.length}개 중 ${newPosts.length}개 신규`);

  // === 스크리닝 캐시 체크 ===
  const allIds = [
    ...newStories.map(s => `hn_${s.id}`),
    ...newPosts.map(p => `reddit_${p.subreddit}_${p.id}`),
  ];
  const cachedScreenings = allIds.length > 0
    ? await db.select().from(screenedItems).where(inArray(screenedItems.id, allIds))
    : [];
  const cachedIds = new Set(cachedScreenings.map(r => r.id));

  const toScreenHN = newStories.filter(s => !cachedIds.has(`hn_${s.id}`));
  const toScreenReddit = newPosts.filter(p => !cachedIds.has(`reddit_${p.subreddit}_${p.id}`));
  console.log(`[스크리닝캐시] HN ${newStories.length}개 중 ${toScreenHN.length}개 신규 스크리닝`);
  console.log(`[스크리닝캐시] Reddit ${newPosts.length}개 중 ${toScreenReddit.length}개 신규 스크리닝`);

  // === 스크리닝 ===
  console.log('🔍 Screening community posts...');
  const [hnResults, redditResults] = await Promise.all([
    screenBatch(toScreenHN.map(s => ({ id: `hn_${s.id}`, title: s.title, abstract: s.title })), 3, 'hn'),
    screenBatch(toScreenReddit.map(p => ({ id: `reddit_${p.subreddit}_${p.id}`, title: p.title, abstract: p.selftext || p.title })), 3, 'reddit'),
  ]);

  // 스크리닝 결과 캐시 저장
  const now = new Date().toISOString();
  for (const [id, result] of hnResults) {
    await db.insert(screenedItems).values({ id, pass: result.pass, score: result.score, screenedAt: now }).onConflictDoNothing();
  }
  for (const [id, result] of redditResults) {
    await db.insert(screenedItems).values({ id, pass: result.pass, score: result.score, screenedAt: now }).onConflictDoNothing();
  }

  // 캐시된 결과도 합산
  for (const cached of cachedScreenings) {
    if (cached.pass) {
      hnResults.set(cached.id, { pass: true, score: cached.score, reason: 'cached' });
      redditResults.set(cached.id, { pass: true, score: cached.score, reason: 'cached' });
    }
  }

  // === score ≥ MIN_SCORE 필터 + 합산 정렬 ===
  const candidates: Scored[] = [
    ...newStories
      .filter(s => hnResults.get(`hn_${s.id}`)?.pass && (hnResults.get(`hn_${s.id}`)?.score ?? 0) >= MIN_SCORE)
      .map(s => ({ source: 'hacker_news' as const, story: s, id: `hn_${s.id}`, score: hnResults.get(`hn_${s.id}`)!.score })),
    ...newPosts
      .filter(p => redditResults.get(`reddit_${p.subreddit}_${p.id}`)?.pass && (redditResults.get(`reddit_${p.subreddit}_${p.id}`)?.score ?? 0) >= MIN_SCORE)
      .map(p => ({ source: 'reddit' as const, post: p, id: `reddit_${p.subreddit}_${p.id}`, score: redditResults.get(`reddit_${p.subreddit}_${p.id}`)!.score })),
  ].sort((a, b) => b.score - a.score).slice(0, MAX_POSTS);

  console.log(`[스크리닝] score≥${MIN_SCORE} 통과 후 top ${candidates.length}개 선택`);

  // === 저장 ===
  let saved = 0;
  for (const c of candidates) {
    if (c.source === 'hacker_news') {
      const s = c.story;
      const hotScore = Math.min(Math.floor(s.score / 5), 100);
      await db.insert(papers).values({
        id: c.id,
        title: s.title,
        abstract: s.title,
        authors: JSON.stringify([s.by]),
        categories: JSON.stringify(['hacker_news']),
        primaryCategory: 'hacker_news',
        publishedAt: new Date(s.time * 1000).toISOString(),
        arxivUrl: s.url ?? `https://news.ycombinator.com/item?id=${s.id}`,
        pdfUrl: '',
        source: 'hacker_news',
        hotScore,
        isHot: hotScore >= 70,
        collectedAt: new Date().toISOString(),
      }).onConflictDoNothing();
    } else {
      const p = c.post;
      const selftext = p.selftext || p.title;

      const hotScore = Math.min(c.score * 10, 100);
      await db.insert(papers).values({
        id: c.id,
        title: p.title,
        abstract: selftext,
        authors: JSON.stringify([p.author]),
        categories: JSON.stringify([`reddit_${p.subreddit}`]),
        primaryCategory: `reddit_${p.subreddit}`,
        publishedAt: new Date(p.created_utc * 1000).toISOString(),
        arxivUrl: p.url || `https://www.reddit.com${p.permalink}`,
        pdfUrl: '',
        source: 'reddit',
        hotScore,
        isHot: hotScore >= 70,
        collectedAt: new Date().toISOString(),
      }).onConflictDoNothing();
    }
    saved++;
    console.log(`  ✅ [${c.source}] score=${c.score} ${c.source === 'hacker_news' ? c.story.title.slice(0, 60) : c.post.title.slice(0, 60)}`);
  }

  console.log(`\n✅ Community: ${saved}개 저장`);
}

main().catch(console.error);
