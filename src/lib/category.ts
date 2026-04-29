// Deprecated: 학술 분류용 색·라벨 매핑만 남김. 사용자 노출 토픽은 src/lib/topics.ts 참조.
// paper-detail/bookmarks의 paper.aiCategory(LLM 분류 결과) 표시 호환.

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
