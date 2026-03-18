import Link from 'next/link';
import { computeBadges } from '@/lib/badges';

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

const sourceLabel: Record<string, string> = {
  hacker_news: 'HN',
  reddit: 'Reddit',
  arxiv: 'arXiv',
  semantic_scholar: 'S2',
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
  venue: string | null;
  affiliations: string | null;
}

export function PaperCard({ id, title, titleKo, oneLiner, aiCategory, source, authors, venue, affiliations }: PaperCardProps) {
  const catColor = aiCategory ? (categoryColorMap[aiCategory] ?? '#888') : '#888';
  const catName = aiCategory ? (categoryDisplayName[aiCategory] ?? aiCategory) : null;
  const srcLabel = source ? (sourceLabel[source] ?? null) : null;
  const badges = computeBadges({ authors, affiliations, venue });

  return (
    <Link href={`/papers/${id}`} className="group block w-full">
      <div
        className="bg-card border-y border-r border-border border-l-[3px] rounded-sm hover:bg-accent transition-colors p-4"
        style={{ borderLeftColor: catColor }}
      >
        <div className="flex flex-col gap-2">
          {/* Top row: category badge + source + badges */}
          <div className="flex items-center gap-2 flex-wrap">
            {catName && (
              <span
                className="font-mono text-[12px] px-1.5 py-0.5 rounded-sm"
                style={{ color: catColor, backgroundColor: `${catColor}1a` }}
              >
                [{catName}]
              </span>
            )}
            {srcLabel && (
              <span className="font-mono text-[11px] text-muted-foreground">
                {srcLabel}
              </span>
            )}
            {badges.map((b, i) => (
              <span key={i} className="font-mono text-[11px] px-1.5 py-0.5 rounded-sm bg-muted text-muted-foreground">
                {b.icon} {b.label}
              </span>
            ))}
          </div>

          {/* Title + description */}
          <div>
            <h3
              className="text-[16px] font-semibold tracking-[-0.02em] leading-tight mb-1 text-foreground group-hover:[color:var(--cat-color)] transition-colors"
              style={{ '--cat-color': catColor } as React.CSSProperties}
            >
              {titleKo || title}
            </h3>
            {oneLiner && (
              <p className="text-[14px] text-muted-foreground leading-relaxed line-clamp-2">
                {oneLiner}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
