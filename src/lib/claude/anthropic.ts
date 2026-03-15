import Anthropic from '@anthropic-ai/sdk';

const MODEL_MAP: Record<string, string> = {
  sonnet: 'claude-sonnet-4-20250514',
  haiku: 'claude-haiku-4-20250414',
};

export async function callAnthropicSDK(
  prompt: string,
  options: { model: string; maxTokens?: number }
): Promise<string> {
  const client = new Anthropic();
  const message = await client.messages.create({
    model: MODEL_MAP[options.model] ?? options.model,
    max_tokens: options.maxTokens ?? 8192,
    messages: [{ role: 'user', content: prompt }],
  });
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}
