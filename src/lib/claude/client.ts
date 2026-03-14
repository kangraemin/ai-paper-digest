import Anthropic from '@anthropic-ai/sdk';
import { SUMMARY_PROMPT } from './prompts';
import type { SummaryResult } from './types';

const client = new Anthropic();

export async function summarizePaper(title: string, abstract: string): Promise<SummaryResult> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{
      role: 'user',
      content: SUMMARY_PROMPT.replace('{title}', title).replace('{abstract}', abstract),
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}

export async function summarizeBatch(
  papers: { id: string; title: string; abstract: string }[],
  concurrency = 5
): Promise<Map<string, SummaryResult>> {
  const results = new Map<string, SummaryResult>();

  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => summarizePaper(p.title, p.abstract))
    );

    settled.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        results.set(batch[idx].id, result.value);
      } else {
        console.error(`Failed to summarize ${batch[idx].id}:`, result.reason);
      }
    });

    if (i + concurrency < papers.length) {
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  return results;
}
