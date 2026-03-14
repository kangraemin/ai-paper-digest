import type { S2Paper } from './types';

const S2_API = 'https://api.semanticscholar.org/graph/v1';

export async function fetchPopularPapers(limit = 5): Promise<S2Paper[]> {
  const url = `${S2_API}/paper/search?query=large+language+model&year=2024-2026&sort=citationCount&limit=${limit}&fields=paperId,title,abstract,authors,year,citationCount,externalIds,fieldsOfStudy`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Semantic Scholar API error: ${res.status}`);

  const data = await res.json();
  return data.data ?? [];
}

export async function fetchPapersByYear(
  year: number,
  opts?: { limit?: number; offset?: number }
): Promise<S2Paper[]> {
  const limit = opts?.limit ?? 100;
  const offset = opts?.offset ?? 0;
  const url = `${S2_API}/paper/search?query=large+language+model&year=${year}&sort=citationCount&limit=${limit}&offset=${offset}&fields=paperId,title,abstract,authors,year,citationCount,externalIds,fieldsOfStudy`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Semantic Scholar API error: ${res.status}`);

  const data = await res.json();
  return data.data ?? [];
}
