const USER_AGENT = 'AI-Paper-Digest/1.0 (by /u/ai_paper_bot)';
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

async function getAccessToken(): Promise<string> {
  const clientId = process.env.REDDIT_CLIENT_ID;
  const clientSecret = process.env.REDDIT_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error('REDDIT_CLIENT_ID / REDDIT_CLIENT_SECRET 환경변수 필요');
  }

  const res = await fetch('https://www.reddit.com/api/v1/access_token', {
    method: 'POST',
    headers: {
      'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
      'User-Agent': USER_AGENT,
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) throw new Error(`Reddit OAuth 토큰 발급 실패: ${res.status}`);
  const data = await res.json();
  return data.access_token as string;
}

export async function fetchRedditAI(
  subreddits = SUBREDDITS,
  opts?: { minScore?: number; timeframe?: 'week' | 'month' }
): Promise<RedditPost[]> {
  const minScore = opts?.minScore ?? 50;
  const timeframe = opts?.timeframe ?? 'week';
  const allPosts: RedditPost[] = [];

  const token = await getAccessToken();

  for (const sub of subreddits) {
    try {
      const res = await fetch(
        `https://oauth.reddit.com/r/${sub}/top?t=${timeframe}&limit=25`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': USER_AGENT,
          },
        }
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

    if (sub !== subreddits[subreddits.length - 1]) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return allPosts;
}
