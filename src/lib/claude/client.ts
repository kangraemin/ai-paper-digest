import { spawn } from 'child_process';
import { SUMMARY_PROMPT } from './prompts';
import { fetchPdfText } from '../pdf-fetcher';
import type { SummaryResult } from './types';

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'sonnet', '--output-format', 'json'], {
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    let stderr = '';
    proc.stdout.on('data', (d: Buffer) => { stdout += d.toString(); });
    proc.stderr.on('data', (d: Buffer) => { stderr += d.toString(); });
    proc.on('close', (code: number | null) => {
      if (code !== 0) {
        reject(new Error(`claude exited ${code}: ${stderr}`));
        return;
      }
      try {
        const envelope = JSON.parse(stdout.trim());
        if (envelope.is_error) {
          reject(new Error(`claude error: ${envelope.result}`));
          return;
        }
        resolve(envelope.result ?? '');
      } catch {
        // fallback: output-format json 파싱 실패 시 raw stdout 사용
        resolve(stdout.trim());
      }
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

  const raw = await runClaude(
    SUMMARY_PROMPT.replace('{title}', title).replace('{content}', content)
  );

  // JSON 추출: 코드블록 처리
  let text = raw.trim();
  if (text.includes('```')) {
    text = text.split('```')[1];
    if (text.startsWith('json')) text = text.slice(4);
    text = text.trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*\}/);
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
