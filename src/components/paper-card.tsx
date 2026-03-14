import Link from 'next/link';
import { Code, Target } from 'lucide-react';

const categoryColorMap: Record<string, string> = {
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

const categoryDisplayName: Record<string, string> = {
  prompting: 'Prompting',
  rag: 'RAG',
  agent: 'Agent',
  'fine-tuning': 'Fine-tuning',
  finetuning: 'Fine-tuning',
  eval: 'Eval',
  'cost-speed': 'Cost',
  cost: 'Cost',
  security: 'Security',
};

const audienceLabel: Record<string, string> = {
  prompting: 'Prompt Engineers',
  rag: 'AI Engineers',
  agent: 'Backend Devs',
  'fine-tuning': 'ML Engineers',
  finetuning: 'ML Engineers',
  eval: 'QA Engineers',
  'cost-speed': 'All Devs',
  cost: 'All Devs',
  security: 'Security Devs',
};

interface PaperCardProps {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  targetAudience: string | null;
  tags: string | null;
  source: string | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

export function PaperCard({ id, title, titleKo, oneLiner, aiCategory, devRelevance, targetAudience, source }: PaperCardProps) {
  const catColor = aiCategory ? (categoryColorMap[aiCategory] ?? '#888') : '#888';
  const catName = aiCategory ? (categoryDisplayName[aiCategory] ?? aiCategory) : null;

  return (
    <Link href={`/papers/${id}`} className="group block w-full">
      <div
        className="bg-zinc-900 border border-zinc-800 border-l-[3px] rounded-sm hover:bg-zinc-800/50 transition-colors p-4"
        style={{ borderLeftColor: catColor }}
      >
        <div className="flex flex-col gap-2">
          {/* Top row: category badge + source */}
          <div className="flex items-center gap-3">
            {catName && (
              <span
                className="font-mono text-[12px] px-1.5 py-0.5 rounded-sm"
                style={{ color: catColor, backgroundColor: `${catColor}1a` }}
              >
                [{catName}]
              </span>
            )}
            {source === 'hacker_news' && (
              <span className="font-mono text-[12px] px-1.5 py-0.5 rounded-sm bg-orange-500/10 text-orange-400">
                HN
              </span>
            )}
          </div>

          {/* Title + description */}
          <div>
            <h3 className="text-[16px] font-semibold text-zinc-100 tracking-[-0.02em] leading-tight mb-1">
              {titleKo || title}
            </h3>
            {oneLiner && (
              <p className="text-[14px] text-zinc-400 leading-relaxed line-clamp-2">
                {oneLiner}
              </p>
            )}
          </div>

          {/* Bottom row */}
          <div className="flex items-center gap-4 mt-2 pt-3 border-t border-zinc-800/50">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Code size={14} className="shrink-0" />
              <span className="font-mono text-[11px]">For: {audienceLabel[aiCategory ?? ''] ?? 'All Devs'}</span>
            </div>
            {devRelevance != null && (
              <div className="flex items-center gap-1.5 shrink-0" style={{ color: catColor }}>
                <Target size={14} />
                <span className="font-mono text-[11px]">{devRelevance * 20}% Match</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
