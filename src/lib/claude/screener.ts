import { runClaude } from './runner';

const PAPER_SCREEN_PROMPT = `You are a filter for an AI digest aimed at people who use Claude/Gemini/ChatGPT daily — NOT researchers, NOT ML engineers.

PASS only if the paper is about:
- Prompting techniques usable right now (chain-of-thought, few-shot, system prompt design)
- Practical workflows for AI-assisted coding or writing
- Security issues directly affecting Claude/Gemini users (prompt injection, jailbreaks)
- Findings that change HOW someone should prompt or use AI tools
- Agent/tool-use patterns a regular user can apply without infrastructure

REJECT everything else, including:
- Fine-tuning, RLHF, model training
- RAG or vector database infrastructure
- Inference optimization, serving, scaling
- New model architecture or theory
- Benchmarks that don't give actionable advice
- Domain-specific applications (medical, legal, robotics, finance)
- Multi-agent orchestration frameworks

If PASS, also rate score 1-10 (10 = a regular user can apply this tomorrow, 1 = barely passes).

Title: {title}
Abstract: {abstract}

Answer in JSON only: {"pass": true/false, "score": 1-10, "reason": "one line explanation"}`;

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

const REDDIT_SCREEN_PROMPT = `You are a filter for an AI digest aimed at people who use Claude/Gemini/ChatGPT daily — general users, not engineers.

PASS only if the post is:
- A practical tip or workflow a regular AI user can apply immediately
- Real user experience with AI tools (prompting techniques, workflows, productivity)
- Useful comparison or guide about AI assistants (Claude, ChatGPT, Gemini)
- Actionable advice on getting better results from AI tools

REJECT if the post is:
- Meme, joke, screenshot with no substance, or reaction post
- Pure news or announcement repost with no technical insight
- AI politics, regulation, or ethics debate
- Rant, complaint, or drama without actionable content
- "AI will replace X" opinion pieces or doom/hype posts
- Low-effort question that can be answered by reading the docs
- Duplicate or repost

Title: {title}

Answer in JSON only: {"pass": true/false, "reason": "one line explanation"}`;

export async function screenPaper(title: string, abstract: string, source: 'paper' | 'hn' | 'reddit' = 'paper'): Promise<{ pass: boolean; score: number; reason: string }> {
  const template = source === 'reddit' ? REDDIT_SCREEN_PROMPT : source === 'hn' ? HN_SCREEN_PROMPT : PAPER_SCREEN_PROMPT;
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
    const result = JSON.parse(jsonMatch[0]);
    return { pass: result.pass, score: result.score ?? 5, reason: result.reason };
  }
  // fallback: pass 못 찾으면 탈락 처리
  return { pass: false, score: 0, reason: 'Failed to parse screening response' };
}

export async function screenBatch(
  papers: { id: string; title: string; abstract: string }[],
  concurrency = 3,
  source: 'paper' | 'hn' | 'reddit' = 'paper'
): Promise<Map<string, { pass: boolean; score: number; reason: string }>> {
  const results = new Map<string, { pass: boolean; score: number; reason: string }>();
  for (let i = 0; i < papers.length; i += concurrency) {
    const batch = papers.slice(i, i + concurrency);
    const settled = await Promise.allSettled(
      batch.map(p => screenPaper(p.title, p.abstract, source).then(r => ({ id: p.id, ...r })))
    );
    for (const result of settled) {
      if (result.status === 'fulfilled') {
        results.set(result.value.id, { pass: result.value.pass, score: result.value.score, reason: result.value.reason });
      }
    }
    console.log(`  스크리닝 ${Math.min(i + concurrency, papers.length)}/${papers.length}`);
    if (i + concurrency < papers.length) await new Promise(r => setTimeout(r, 1000));
  }
  return results;
}
