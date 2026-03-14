const HN_API = 'https://hacker-news.firebaseio.com/v0';

export interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

export interface AlgoliaHNHit {
  objectID: string;
  title: string;
  url?: string;
  points: number;
  author: string;
  created_at_i: number;
  num_comments: number;
}

const AI_KEYWORDS = [
  'AI', 'LLM', 'GPT', 'Claude', 'machine learning', 'deep learning',
  'neural', 'transformer', 'language model', 'ChatGPT', 'OpenAI',
  'Anthropic', 'RAG', 'agent', 'fine-tuning', 'embedding', 'prompt',
  'diffusion', 'Gemini', 'Llama', 'Mistral',
];

export async function fetchHNTopAI(limit = 30): Promise<HNItem[]> {
  const res = await fetch(`${HN_API}/topstories.json`);
  const ids: number[] = await res.json();

  // 상위 200개만 fetch (API 부담 최소화)
  const items: HNItem[] = await Promise.all(
    ids.slice(0, 200).map(id =>
      fetch(`${HN_API}/item/${id}.json`).then(r => r.json())
    )
  );

  return items
    .filter(item =>
      item && item.type === 'story' && item.score >= 50 &&
      AI_KEYWORDS.some(kw => item.title.toLowerCase().includes(kw.toLowerCase()))
    )
    .slice(0, limit);
}

export async function fetchHNComments(storyId: number, limit = 10): Promise<string[]> {
  const storyRes = await fetch(`${HN_API}/item/${storyId}.json`);
  const story = await storyRes.json();
  const kids: number[] = story.kids?.slice(0, limit) ?? [];

  const comments = await Promise.all(
    kids.map(id => fetch(`${HN_API}/item/${id}.json`).then(r => r.json()))
  );

  return comments
    .filter((c: { text?: string; dead?: boolean; deleted?: boolean }) => c && c.text && !c.dead && !c.deleted)
    .map((c: { text: string }) => c.text.replace(/<[^>]*>/g, ''));
}

export async function fetchHNStoriesAlgolia(
  opts?: { daysBack?: number; minScore?: number; maxPages?: number }
): Promise<AlgoliaHNHit[]> {
  const daysBack = opts?.daysBack ?? 180;
  const minScore = opts?.minScore ?? 50;
  const maxPages = opts?.maxPages ?? 10;

  const since = Math.floor(Date.now() / 1000) - daysBack * 86400;
  const all: AlgoliaHNHit[] = [];

  for (let page = 0; page < maxPages; page++) {
    const url = `https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${since},points>${minScore}&hitsPerPage=100&page=${page}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Algolia HN API error: ${res.status}`);

    const data = await res.json();
    const hits: AlgoliaHNHit[] = data.hits ?? [];
    if (hits.length === 0) break;

    const aiHits = hits.filter(hit =>
      AI_KEYWORDS.some(kw => hit.title.toLowerCase().includes(kw.toLowerCase()))
    );
    all.push(...aiHits);

    console.log(`  [HN Algolia] page ${page + 1}: ${hits.length}건 중 ${aiHits.length}건 AI 관련`);

    if (hits.length < 100) break;
    await new Promise(r => setTimeout(r, 500));
  }

  return all;
}
