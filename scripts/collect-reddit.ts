import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchRedditAI } from '../src/lib/reddit/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('🔴 Fetching AI posts from Reddit...');
  const posts = await fetchRedditAI();
  console.log(`Found ${posts.length} AI-related Reddit posts`);

  // Claude 스크리닝
  console.log('🔍 Screening posts...');
  const screenResults = await screenBatch(
    posts.map(p => ({ id: `reddit_${p.subreddit}_${p.id}`, title: p.title, abstract: p.selftext || p.title })),
    3,
    'reddit'
  );
  const passed = posts
    .filter(p => screenResults.get(`reddit_${p.subreddit}_${p.id}`)?.pass)
    .sort((a, b) => {
      const sa = screenResults.get(`reddit_${a.subreddit}_${a.id}`)?.score ?? 0;
      const sb = screenResults.get(`reddit_${b.subreddit}_${b.id}`)?.score ?? 0;
      return sb - sa;
    })
    .slice(0, 5);
  console.log(`[스크리닝] ${posts.length}편 중 ${passed.length}편 통과 (상위 5개)`);

  let newCount = 0;
  for (const post of passed) {
    const id = `reddit_${post.subreddit}_${post.id}`;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) continue;

    const hotScore = Math.min((screenResults.get(id)?.score ?? 5) * 10, 100);
    await db.insert(papers).values({
      id,
      title: post.title,
      abstract: post.selftext || post.title,
      authors: JSON.stringify([post.author]),
      categories: JSON.stringify([`reddit_${post.subreddit}`]),
      primaryCategory: `reddit_${post.subreddit}`,
      publishedAt: new Date(post.created_utc * 1000).toISOString(),
      arxivUrl: post.url || `https://www.reddit.com${post.permalink}`,
      pdfUrl: '',
      source: 'reddit',
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ Reddit: ${passed.length} posts, ${newCount} new`);
}

main().catch(console.error);
