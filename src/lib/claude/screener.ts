import { spawn } from 'child_process';

const PAPER_SCREEN_PROMPT = `You are a filter for an AI paper digest aimed at developers who build apps using GPT/Claude APIs.
Decide if this paper is useful for such developers (NOT researchers, NOT ML engineers training models).
Papers about prompting, RAG, agents, tool use, fine-tuning, eval, inference optimization, code generation are useful.
Papers about model architecture, pure theory, math proofs, specialized domains (medical, legal, robotics) are NOT useful.

Title: {title}
Abstract: {abstract}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

const HN_SCREEN_PROMPT = `You are a filter for an AI/dev news digest. The audience is developers who build software with AI (LLMs, APIs, agents).

Pass if the post is about ANY of these:
- AI tools, products, SDKs, APIs (GPT, Claude, Gemini, open-source LLMs, etc.)
- Developer experience with AI (coding assistants, workflows, productivity)
- AI engineering (RAG, agents, prompting, eval, deployment, fine-tuning)
- AI industry news (launches, pricing, benchmarks, policy affecting developers)
- Software engineering practices related to AI integration
- Open source AI projects, models, frameworks

Reject ONLY if the post is clearly:
- Non-tech (politics, finance, health with no AI angle)
- Pure academic ML research with no practical application
- Job postings or hiring threads
- Unrelated to AI/software development entirely

When in doubt, PASS. We prefer more content over less.

Title: {title}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

function runClaude(prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const proc = spawn('claude', ['-p', '--model', 'haiku'], {
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

export async function screenPaper(title: string, abstract: string, source: 'paper' | 'hn' = 'paper'): Promise<{ pass: boolean; reason: string }> {
  const template = source === 'hn' ? HN_SCREEN_PROMPT : PAPER_SCREEN_PROMPT;
  const prompt = template.replace('{title}', title).replace('{abstract}', abstract);
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
  concurrency = 3,
  source: 'paper' | 'hn' = 'paper'
): Promise<Map<string, { pass: boolean; reason: string }>> {
  const results = new Map<string, { pass: boolean; reason: string }>();
  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => screenPaper(p.title, p.abstract, source).then(r => ({ id: p.id, ...r })))
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
