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
