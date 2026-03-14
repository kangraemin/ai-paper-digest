import Link from 'next/link';

const CATEGORY_STYLES: Record<string, string> = {
  prompting: 'bg-blue-500/15 text-blue-700 dark:text-blue-300',
  rag: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300',
  agent: 'bg-violet-500/15 text-violet-700 dark:text-violet-300',
  'fine-tuning': 'bg-orange-500/15 text-orange-700 dark:text-orange-300',
  eval: 'bg-pink-500/15 text-pink-700 dark:text-pink-300',
  'cost-speed': 'bg-teal-500/15 text-teal-700 dark:text-teal-300',
};

interface PaperCardProps {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  targetAudience: string | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

export function PaperCard({ id, title, titleKo, oneLiner, aiCategory, targetAudience, isHot, authors }: PaperCardProps) {
  const authorList = JSON.parse(authors) as string[];
  const displayAuthors = authorList.length > 3
    ? `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3}`
    : authorList.join(', ');

  return (
    <Link href={`/papers/${id}`}>
      <div className="py-4 border-b border-border hover:bg-muted/30 transition-colors">
        {targetAudience && (
          <p className="text-[15px] font-medium text-amber-700 dark:text-amber-400 mb-1.5">
            {targetAudience}
          </p>
        )}

        <div className="flex items-start gap-2 mb-1">
          <h3 className="font-semibold leading-snug flex-1">{titleKo || title}</h3>
          {isHot && <span className="text-orange-500 shrink-0">🔥</span>}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {aiCategory && (
            <span className={`font-mono px-1.5 py-0.5 rounded ${CATEGORY_STYLES[aiCategory] || ''}`}>
              {aiCategory}
            </span>
          )}
          {oneLiner && <span className="line-clamp-1 flex-1">{oneLiner}</span>}
        </div>

        <div className="text-xs text-muted-foreground mt-1 font-mono">
          {displayAuthors}
        </div>
      </div>
    </Link>
  );
}
