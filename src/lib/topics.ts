import { like, or } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { papers } from '@/lib/db/schema';

export const TOPIC_SLUGS = [
  'claude',
  'claude-code',
  'agent',
  'code',
  'reasoning',
  'mcp',
  'multimodal',
  'rag',
  'safety',
  'eval',
  'prompting',
  'finetuning',
] as const;
export type TopicSlug = typeof TOPIC_SLUGS[number];

export const TOPIC_NAME_KO: Record<TopicSlug, string> = {
  'claude': 'Claude',
  'claude-code': 'Claude Code',
  'agent': '에이전트',
  'code': '코드 생성',
  'reasoning': '추론',
  'mcp': 'MCP',
  'multimodal': '멀티모달',
  'rag': 'RAG',
  'safety': '안전·보안',
  'eval': '평가·벤치마크',
  'prompting': '프롬프트',
  'finetuning': '파인튜닝',
};

export const TOPIC_NAME_EN: Record<TopicSlug, string> = {
  'claude': 'Claude',
  'claude-code': 'Claude Code',
  'agent': 'Agent',
  'code': 'Code Generation',
  'reasoning': 'Reasoning',
  'mcp': 'MCP',
  'multimodal': 'Multimodal',
  'rag': 'RAG',
  'safety': 'Safety & Security',
  'eval': 'Evaluation & Benchmark',
  'prompting': 'Prompting',
  'finetuning': 'Fine-tuning',
};

export const TOPIC_COLOR: Record<TopicSlug, string> = {
  'claude': '#cc785c',
  'claude-code': '#cc785c',
  'agent': '#8b5cf6',
  'code': '#3b82f6',
  'reasoning': '#a855f7',
  'mcp': '#06b6d4',
  'multimodal': '#ec4899',
  'rag': '#10b981',
  'safety': '#ef4444',
  'eval': '#eab308',
  'prompting': '#6366f1',
  'finetuning': '#f97316',
};

export function isTopicSlug(s: string): s is TopicSlug {
  return (TOPIC_SLUGS as readonly string[]).includes(s);
}

function tagLike(...tags: string[]): SQL[] {
  return tags.flatMap((t) => [
    like(papers.tags, `%"${t}"%`),
    like(papers.tagsEn, `%"${t}"%`),
  ]);
}

function textLike(...kws: string[]): SQL[] {
  return kws.flatMap((kw) => [
    like(papers.title, `%${kw}%`),
    like(papers.abstract, `%${kw}%`),
    like(papers.titleKo, `%${kw}%`),
    like(papers.summaryKo, `%${kw}%`),
  ]);
}

export function topicCondition(slug: TopicSlug): SQL {
  switch (slug) {
    case 'claude':
      return or(...textLike('claude', 'anthropic'))!;
    case 'claude-code':
      return or(...textLike('claude code', 'claude-code'))!;
    case 'agent':
      return or(...tagLike('에이전트', 'agent', '도구사용', 'tool use', '함수호출', 'function calling'))!;
    case 'code':
      return or(...tagLike('코드생성', 'code generation'), ...textLike('coding'))!;
    case 'reasoning':
      return or(
        ...tagLike('추론최적화', 'inference optimization'),
        ...textLike('reasoning', 'chain-of-thought', 'chain of thought'),
      )!;
    case 'mcp':
      return or(...tagLike('mcp', 'MCP'), ...textLike('model context protocol'))!;
    case 'multimodal':
      return or(...tagLike('멀티모달', 'multimodal'), ...textLike('vision-language'))!;
    case 'rag':
      return or(...tagLike(
        'rag', 'RAG', '임베딩', 'embedding', '벡터검색', 'vector search', '청킹', 'chunking',
      ))!;
    case 'safety':
      return or(...tagLike(
        '보안', 'security', '프롬프트인젝션', 'prompt injection',
        '레드팀', 'red team', 'red teaming', '프라이버시', 'privacy',
      ))!;
    case 'eval':
      return or(...tagLike('평가', 'evaluation', '벤치마크', 'benchmark'))!;
    case 'prompting':
      return or(...tagLike('프롬프트엔지니어링', 'prompt engineering'))!;
    case 'finetuning':
      return or(...tagLike('파인튜닝', 'fine-tuning', 'rlhf', 'lora', '양자화', 'quantization'))!;
  }
}
