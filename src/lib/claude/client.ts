import { runClaude } from './runner';
import { SUMMARY_PROMPT } from './prompts';
import { fetchPdfText } from '../pdf-fetcher';
import type { SummaryResult } from './types';

export async function summarizePaper(
  title: string,
  abstract: string,
  pdfUrl?: string
): Promise<SummaryResult> {
  let content = abstract;

  if (pdfUrl) {
    const pdfText = await fetchPdfText(pdfUrl);
    if (pdfText.length > 200) {
      content = pdfText;
    }
  }

  const raw = await runClaude(
    SUMMARY_PROMPT.replace('{title}', title).replace('{content}', content),
    { model: 'sonnet', timeout: 120000, jsonOutput: true }
  );

  // JSON 추출: 코드블록/backtick 관계없이 outermost {} 탐색
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.error(`[summarize] 파싱 실패. claude 응답:\n${raw.slice(0, 300)}`);
    throw new Error('Failed to parse summary response');
  }
  return JSON.parse(jsonMatch[0]);
}

export async function summarizeBatch(
  papers: { id: string; title: string; abstract: string; pdfUrl?: string }[],
  concurrency = 5
): Promise<Map<string, SummaryResult>> {
  const results = new Map<string, SummaryResult>();

  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => summarizePaper(p.title, p.abstract, p.pdfUrl))
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
