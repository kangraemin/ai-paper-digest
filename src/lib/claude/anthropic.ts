import Anthropic from '@anthropic-ai/sdk';

const MODEL_MAP: Record<string, string> = {
  sonnet: 'claude-sonnet-5-5',
  haiku: 'claude-haiku-5-5',
};

export interface SDKOptions {
  model: string;
  maxTokens?: number;
  effort?: 'low' | 'medium' | 'high';
  schema?: object; // 주면 구조화 출력(json_schema)으로 받는다
}

const client = new Anthropic({ maxRetries: 4 });

export async function callAnthropicSDK(prompt: string, options: SDKOptions): Promise<string> {
  const message = await client.messages.create({
    model: MODEL_MAP[options.model] ?? options.model,
    max_tokens: options.maxTokens ?? 8192,
    messages: [{ role: 'user', content: prompt }],
    ...((options.effort || options.schema) && {
      output_config: {
        ...(options.effort && { effort: options.effort }),
        ...(options.schema && { format: { type: 'json_schema', schema: options.schema } }),
      },
    }),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any) as Anthropic.Message;
  // 잘리거나 거절된 응답을 성공처럼 넘기지 않는다
  if (message.stop_reason === 'max_tokens') throw new Error('response truncated (max_tokens)');
  if (message.stop_reason === 'refusal') throw new Error('model refused');
  return message.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');
}
