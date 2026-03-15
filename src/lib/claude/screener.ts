import { runClaude } from './runner';

const PAPER_SCREEN_PROMPT = `You are a filter for an AI paper digest aimed at developers who build apps using GPT/Claude APIs.
Decide if this paper is useful for such developers (NOT researchers, NOT ML engineers training models).
Papers about prompting, RAG, agents, tool use, fine-tuning, eval, inference optimization, code generation are useful.
Papers about model architecture, pure theory, math proofs, specialized domains (medical, legal, robotics) are NOT useful.

Title: {title}
Abstract: {abstract}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

const HN_SCREEN_PROMPT = `You are a filter for an AI/dev digest. The audience is developers who BUILD software with AI.

The key question: "Will a developer learn something actionable from this post?"

PASS if the post is:
- Technical tutorial, guide, or deep dive on AI tools (Claude, GPT, Gemini, open-source LLMs)
- Developer workflow or productivity with AI (coding assistants, agents, IDE integration)
- AI engineering practice (RAG, prompting, eval, deployment, fine-tuning, embeddings)
- Security vulnerability or incident affecting developer tools
- Open source AI project with technical substance
- Benchmark or comparison with technical analysis
- Real-world experience report with lessons learned

REJECT if the post is:
- Pure news/announcement with no technical depth ("X raised $NB", "Y launched Z")
- AI politics, regulation, policy, ethics debate
- Opinion essay or hot take without technical content
- CEO quotes, executive drama, company gossip
- General AI hype or doom ("AI will replace X", "AI makes you Y")
- Non-developer audience (business strategy, investing, legal)
- Job postings or hiring threads
- Duplicate of another post

When in doubt, REJECT. Quality over quantity.

Title: {title}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

export async function screenPaper(title: string, abstract: string, source: 'paper' | 'hn' = 'paper'): Promise<{ pass: boolean; reason: string }> {
  const template = source === 'hn' ? HN_SCREEN_PROMPT : PAPER_SCREEN_PROMPT;
  const prompt = template.replace('{title}', title).replace('{abstract}', abstract);
  let text = await runClaude(prompt, { model: 'haiku', timeout: 60000 });

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
