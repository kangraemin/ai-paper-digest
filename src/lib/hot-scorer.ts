import type { ArxivEntry } from './arxiv/types';

const BUZZ_KEYWORDS = [
  'GPT', 'LLM', 'ChatGPT', 'large language',
  'reasoning', 'chain-of-thought', 'agent', 'multimodal',
  'benchmark', 'prompting', 'RAG', 'retrieval',
  'tool use', 'function calling', 'fine-tuning', 'LoRA',
  'quantization', 'code generation', 'inference', 'eval', 'embedding',
];

export function calculateHotScore(paper: ArxivEntry): number {
  let score = 0;

  if (paper.authors.length >= 10) score += 20;
  else if (paper.authors.length >= 5) score += 10;

  if (paper.categories.length >= 3) score += 15;
  else if (paper.categories.length >= 2) score += 5;

  const text = `${paper.title} ${paper.abstract}`.toLowerCase();
  const matchCount = BUZZ_KEYWORDS.filter(kw => text.includes(kw.toLowerCase())).length;
  score += Math.min(matchCount * 10, 40);

  if (paper.title.length < 60) score += 5;

  return Math.min(score, 100);
}
