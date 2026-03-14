import { spawn } from 'child_process';

const SCREEN_PROMPT = `You are a filter for an AI paper digest aimed at developers who build apps using GPT/Claude APIs.
Decide if this paper is useful for such developers (NOT researchers, NOT ML engineers training models).
Papers about prompting, RAG, agents, tool use, fine-tuning, eval, inference optimization, code generation are useful.
Papers about model architecture, pure theory, math proofs, specialized domains (medical, legal, robotics) are NOT useful.

Title: {title}
Abstract: {abstract}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'opus'], {
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
    setTimeout(() => { proc.kill(); reject(new Error('timeout')); }, 60000);
  });
}

export async function screenPaper(title: string, abstract: string): Promise<{ pass: boolean; reason: string }> {
  const prompt = SCREEN_PROMPT.replace('{title}', title).replace('{abstract}', abstract);
  let text = await runClaude(prompt);

  // JSON 추출: 코드블록, 또는 { } 매칭
  if (text.includes('```')) {
    text = text.split('```')[1];
    if (text.startsWith('json')) text = text.slice(4);
    text = text.trim();
  }
  const jsonMatch = text.match(/\{[\s\S]*?"pass"[\s\S]*?\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  // fallback: pass 못 찾으면 탈락 처리
  return { pass: false, reason: 'Failed to parse screening response' };
}

export async function screenBatch(
  papers: { id: string; title: string; abstract: string }[],
  concurrency = 3
): Promise<Map<string, { pass: boolean; reason: string }>> {
  const results = new Map<string, { pass: boolean; reason: string }>();
  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => screenPaper(p.title, p.abstract).then(r => ({ id: p.id, ...r })))
    );
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results.set(result.value.id, { pass: result.value.pass, reason: result.value.reason });
      }
    }
    console.log(`  스크리닝 ${Math.min(i + concurrency, papers.length)}/${papers.length}`);
    if (i + concurrency < papers.length) await new Promise(r => setTimeout(r, 1000));
  }
  return results;
}
