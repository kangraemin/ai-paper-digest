export const CATEGORY_SLUGS = ['prompting', 'rag', 'agent', 'finetuning', 'eval', 'cost', 'security'] as const;
export type CategorySlug = typeof CATEGORY_SLUGS[number];

export const CATEGORY_COLOR: Record<string, string> = {
  prompting: '#3b82f6',
  rag: '#10b981',
  agent: '#8b5cf6',
  'fine-tuning': '#f97316',
  finetuning: '#f97316',
  eval: '#ec4899',
  'cost-speed': '#14b8a6',
  cost: '#14b8a6',
  security: '#ef4444',
};

export const CATEGORY_NAME: Record<string, string> = {
  prompting: 'Prompting',
  rag: 'RAG',
  agent: 'Agent',
  'fine-tuning': 'Fine-tuning',
  finetuning: 'Fine-tuning',
  eval: 'Eval',
  'cost-speed': 'Cost/Speed',
  cost: 'Cost/Speed',
  security: 'Security',
};

export function isCategorySlug(s: string): s is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(s);
}
