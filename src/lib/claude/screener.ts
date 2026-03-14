import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

const SCREEN_PROMPT = `You are a filter for an AI paper digest aimed at developers who build apps using GPT/Claude APIs.
Decide if this paper is useful for such developers (NOT researchers, NOT ML engineers training models).
Papers about prompting, RAG, agents, tool use, fine-tuning, eval, inference optimization, code generation are useful.
Papers about model architecture, pure theory, math proofs, specialized domains (medical, legal, robotics) are NOT useful.

Title: {title}
Abstract: {abstract}

Answer in JSON: {"pass": true/false, "reason": "one line explanation"}`;

export async function screenPaper(title: string, abstract: string): Promise<{ pass: boolean; reason: string }> {
  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 100,
    messages: [{
      role: 'user',
      content: SCREEN_PROMPT.replace('{title}', title).replace('{abstract}', abstract),
    }],
  });
  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return JSON.parse(text);
}

export async function screenBatch(
  papers: { id: string; title: string; abstract: string }[],
  concurrency = 10
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
    if (i + concurrency < papers.length) await new Promise(r => setTimeout(r, 500));
  }
  return results;
}
