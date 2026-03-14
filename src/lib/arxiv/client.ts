import { XMLParser } from 'fast-xml-parser';
import type { ArxivEntry } from './types';

const ARXIV_API = 'https://export.arxiv.org/api/query';
const CATEGORIES = ['cs.AI', 'cs.CL', 'cs.LG'];

const PRACTICAL_KEYWORDS = [
  'prompting', 'prompt engineering', 'RAG', 'retrieval-augmented',
  'agent', 'tool use', 'function calling', 'fine-tuning', 'LoRA',
  'RLHF', 'DPO', 'inference', 'quantization', 'distillation',
  'eval', 'benchmark', 'code generation', 'in-context learning',
  'chain-of-thought', 'embedding', 'chunking', 'vector search',
];

export async function fetchRecentPapers(maxResults = 100): Promise<ArxivEntry[]> {
  const catQuery = CATEGORIES.map(c => `cat:${c}`).join('+OR+');
  const absQuery = PRACTICAL_KEYWORDS.map(k => `abs:${k}`).join('+OR+');
  const query = `(${catQuery})+AND+(${absQuery})`;
  const url = `${ARXIV_API}?search_query=${query}&sortBy=submittedDate&sortOrder=descending&max_results=${maxResults}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);

  const entries = parsed.feed?.entry;
  if (!entries) return [];

  return (Array.isArray(entries) ? entries : [entries]).map(parseEntry);
}

function parseEntry(entry: Record<string, unknown>): ArxivEntry {
  const rawId = String(entry.id ?? '');
  const id = rawId.split('/abs/').pop()?.replace(/v\d+$/, '') ?? rawId;
  return {
    id,
    title: String(entry.title ?? '').replace(/\n/g, ' ').trim(),
    abstract: String(entry.summary ?? '').replace(/\n/g, ' ').trim(),
    authors: (Array.isArray(entry.author) ? entry.author : [entry.author])
      .map((a: Record<string, unknown>) => String(a.name ?? '')),
    categories: (Array.isArray(entry.category) ? entry.category : [entry.category])
      .map((c: Record<string, unknown>) => String(c['@_term'] ?? '')),
    primaryCategory: String(
      (entry['arxiv:primary_category'] as Record<string, unknown>)?.['@_term'] ?? ''
    ),
    publishedAt: String(entry.published ?? ''),
    updatedAt: String(entry.updated ?? ''),
    arxivUrl: `https://arxiv.org/abs/${id}`,
    pdfUrl: `https://arxiv.org/pdf/${id}`,
  };
}
