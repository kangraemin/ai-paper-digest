import { runClaude } from './runner';

const PAPER_SCREEN_PROMPT = `You are a strict filter for an AI digest. The audience is software developers who build products with AI.

PASS ONLY if the paper directly enables a developer to improve their prompting, AI workflows, or agent design TODAY. The bar is high.

PASS only if ALL of these are true:
- The technique/finding is immediately applicable without model training or infra setup
- A developer can change their prompting or tool usage based on this paper
- The insight is non-obvious and not already common knowledge

PASS examples:
- Novel prompting technique with clear before/after results
- Security vulnerability a developer must defend against (prompt injection, jailbreak)
- Agent design pattern a developer can implement this week
- Finding that changes how developers should structure AI workflows

REJECT everything else, including:
- Fine-tuning, RLHF, model training, model architecture
- RAG infrastructure, vector databases, embedding optimization
- Inference optimization, serving, scaling, hardware
- Benchmarks and evaluations without actionable takeaways
- Domain-specific applications (medical, legal, robotics, finance, education)
- Theoretical analysis, mathematical proofs, formal verification
- Datasets, data collection, annotation methodology
- Multi-modal research (vision, audio, video) unless directly about prompting
- Any paper where the main contribution requires compute > a single API call

When in doubt, REJECT. Only 1 in 10 papers should pass.

Rate score 1-10 only if PASS (10 = apply tomorrow, 7 = apply this week, below 7 = borderline).

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

Rate score 1-10 if PASS (10 = apply tomorrow, 6 = interesting but less urgent).

Title: {title}

Answer in JSON only: {"pass": true/false, "score": 1-10, "reason": "one line explanation"}`;

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

Rate score 1-10 if PASS (10 = apply tomorrow, 6 = useful but less urgent).

Title: {title}

Answer in JSON only: {"pass": true/false, "score": 1-10, "reason": "one line explanation"}`;

export async function screenPaper(title: string, abstract: string, source: 'paper' | 'hn' | 'reddit' = 'paper'): Promise<{ pass: boolean; score: number; reason: string }> {
  if (!process.env.ANTHROPIC_API_KEY) {
    return { pass: true, score: 5, reason: 'Screening skipped - no API key (manual review required)' };
  }
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
