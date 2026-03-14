import { spawn } from 'child_process';
import { SUMMARY_PROMPT } from './prompts';
import { fetchPdfText } from '../pdf-fetcher';
import type { SummaryResult } from './types';

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'sonnet'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code: number | null) => {
      if (code === 0) resolve(stdout.trim());
      else reject(new Error(`claude exited ${code}: ${stderr}`));
    });
    proc.on('error', reject);
    proc.stdin.write(prompt);
    proc.stdin.end();
    setTimeout(() => { proc.kill(); reject(new Error('timeout')); }, 120000);
  });
}

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

  let text = await runClaude(
    SUMMARY_PROMPT.replace('{title}', title).replace('{content}', content)
  );

  // JSON 추출: 코드블록 처리
  if (text.includes('```')) {
    text = text.split('```')[1];
    if (text.startsWith('json')) text = text.slice(4);
    text = text.trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Failed to parse summary response');
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
