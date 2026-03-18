import { XMLParser } from 'fast-xml-parser';

const USER_AGENT = 'AI-Paper-Digest/1.0';

const DEFAULT_SUBREDDITS = [
  { sub: 'ChatGPT', limit: 30 },
  { sub: 'ClaudeAI', limit: 30 },
  { sub: 'GoogleGeminiAI', limit: 30 },
  { sub: 'MachineLearning', limit: 20 },
  { sub: 'artificial', limit: 20 },
];

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
  subreddits = DEFAULT_SUBREDDITS,
  opts?: { timeframe?: 'week' | 'month' }
): Promise<RedditPost[]> {
  const timeframe = opts?.timeframe ?? 'week';
  const allPosts: RedditPost[] = [];
  const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@_' });

  for (const { sub, limit } of subreddits) {
    try {
      const res = await fetch(
        `https://www.reddit.com/r/${sub}/top.rss?t=${timeframe}&limit=${limit}`,
        { headers: { 'User-Agent': USER_AGENT } }
      );

      if (!res.ok) {
        console.warn(`[Reddit] r/${sub} fetch failed: ${res.status}`);
        continue;
      }

      const xml = await res.text();
      const parsed = parser.parse(xml);
      const entries: Record<string, unknown>[] = ([] as Record<string, unknown>[]).concat(parsed?.feed?.entry ?? []);

      const posts: RedditPost[] = entries.map((entry) => {
        const links: unknown[] = ([] as unknown[]).concat(entry.link ?? []);
        const altLink = links.find((l: unknown) => (l as Record<string, string>)['@_rel'] === 'alternate') as Record<string, string> | undefined;
        const permalink = altLink?.['@_href'] ?? '';
        const id = String(entry.id ?? '').split('_').pop() ?? '';
        const authorName = String((entry.author as Record<string, string>)?.name ?? '').replace('/u/', '');
        const updated = String(entry.updated ?? '');

        return {
          id,
          title: String(entry.title ?? ''),
          url: permalink,
          score: 0,
          author: authorName,
          created_utc: updated ? Math.floor(new Date(updated).getTime() / 1000) : 0,
          num_comments: 0,
          permalink: permalink.replace('https://www.reddit.com', ''),
          subreddit: sub,
          selftext: '',
        };
      });

      allPosts.push(...posts);
      console.log(`  [Reddit] r/${sub}: ${posts.length}건`);
    } catch (err) {
      console.warn(`[Reddit] r/${sub} error:`, err);
    }

    if (sub !== subreddits[subreddits.length - 1].sub) {
      await new Promise(r => setTimeout(r, 500));
    }
  }

  return allPosts;
}
