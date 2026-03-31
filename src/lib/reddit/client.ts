import { XMLParser } from 'fast-xml-parser';

const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36';

const DEFAULT_SUBREDDITS = [
  { sub: 'ChatGPT', limit: 50 },
  { sub: 'ClaudeAI', limit: 50 },
  { sub: 'MachineLearning', limit: 50 },
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
        const firstLink = links[0] as Record<string, string> | undefined;
        const permalink = altLink?.['@_href'] ?? firstLink?.['@_href'] ?? String((entry.link as Record<string, string>)?.['@_href'] ?? entry.link ?? '');
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

export async function fetchRedditPostContent(permalink: string): Promise<string> {
  const url = `https://www.reddit.com${permalink}.json?limit=0`;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
      if (res.status === 429 || res.status === 403) {
        console.log(`  [Reddit] ${res.status} on ${permalink.slice(0, 40)}, retry ${attempt}/3 in ${attempt * 3}s...`);
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }
      if (!res.ok) return '';
      const data = await res.json();
      return data[0]?.data?.children?.[0]?.data?.selftext ?? '';
    } catch {
      if (attempt < 3) {
        await new Promise(r => setTimeout(r, attempt * 3000));
        continue;
      }
      return '';
    }
  }
  return '';
}

export async function fetchRedditComments(permalink: string, limit = 10): Promise<string[]> {
  try {
    const url = `https://www.reddit.com${permalink}.json?limit=${limit}&depth=1`;
    const res = await fetch(url, { headers: { 'User-Agent': USER_AGENT } });
    if (!res.ok) return [];

    const data = await res.json();
    const comments = data[1]?.data?.children ?? [];

    return comments
      .filter((c: { kind: string; data: { body?: string; stickied?: boolean } }) =>
        c.kind === 't1' && c.data.body && c.data.body !== '[deleted]' && c.data.body !== '[removed]' && !c.data.stickied
      )
      .map((c: { data: { body: string } }) => c.data.body)
      .slice(0, limit);
  } catch {
    return [];
  }
}
