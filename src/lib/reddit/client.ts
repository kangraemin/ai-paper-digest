const USER_AGENT = 'AI-Paper-Digest/1.0';
const SUBREDDITS = ['MachineLearning', 'LocalLLaMA', 'ChatGPT', 'ClaudeAI', 'artificial'];

export interface RedditPost {
  id: string;
  title: string;
  url: string;
  score: number;
  author: string;
  created_utc: number;
  num_comments: number;
  permalink: string;
  subreddit: string;
  selftext: string;
}

export async function fetchRedditAI(
  subreddits = SUBREDDITS,
  opts?: { minScore?: number; timeframe?: 'week' | 'month' }
): Promise<RedditPost[]> {
  const minScore = opts?.minScore ?? 50;
  const timeframe = opts?.timeframe ?? 'week';
  const allPosts: RedditPost[] = [];

  for (const sub of subreddits) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.json?t=${timeframe}&limit=25`,
        { headers: { 'User-Agent': USER_AGENT } }
      );

      if (!res.ok) {
        console.warn(`[Reddit] r/${sub} fetch failed: ${res.status}`);
        continue;
      }

      const data = await res.json();
      const posts: RedditPost[] = (data?.data?.children ?? [])
        .map((child: { data: Record<string, unknown> }) => ({
          id: child.data.id as string,
          title: child.data.title as string,
          url: child.data.url as string,
          score: child.data.score as number,
          author: child.data.author as string,
          created_utc: child.data.created_utc as number,
          num_comments: child.data.num_comments as number,
          permalink: child.data.permalink as string,
          subreddit: child.data.subreddit as string,
          selftext: child.data.selftext as string,
        }))
        .filter((post: RedditPost) => post.score >= minScore);

      allPosts.push(...posts);
      console.log(`  [Reddit] r/${sub}: ${posts.length}건 (score >= ${minScore})`);
    } catch (err) {
      console.warn(`[Reddit] r/${sub} error:`, err);
    }

    // 서브레딧 간 500ms 딜레이 (레이트 리밋 방지)
    if (sub !== subreddits[subreddits.length - 1]) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return allPosts;
}
