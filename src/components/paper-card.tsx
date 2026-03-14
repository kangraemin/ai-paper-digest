import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HotBadge } from './hot-badge';

const CATEGORY_COLORS: Record<string, string> = {
  nlp: 'bg-blue-500',
  cv: 'bg-emerald-500',
  rl: 'bg-amber-500',
  multimodal: 'bg-violet-500',
  agent: 'bg-red-500',
  reasoning: 'bg-pink-500',
  optimization: 'bg-teal-500',
  safety: 'bg-orange-500',
  architecture: 'bg-indigo-500',
  other: 'bg-gray-500',
};

interface PaperCardProps {
  id: string;
  title: string;
  titleKo: string | null;
  summaryKo: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  devNote: string | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function PaperCard({ id, title, titleKo, summaryKo, aiCategory, devRelevance, devNote, isHot, publishedAt, authors }: PaperCardProps) {
  const authorList = JSON.parse(authors) as string[];
  const displayAuthors = authorList.length > 3
    ? `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3}`
    : authorList.join(', ');

  return (
    <Link href={`/papers/${id}`}>
      <Card className="transition-shadow hover:shadow-md">
        <CardContent className="py-4">
          <div className="flex items-center gap-2 mb-1.5">
            {isHot && <HotBadge />}
            {aiCategory && (
              <Badge variant="secondary" className={`text-xs text-white ${CATEGORY_COLORS[aiCategory] || ''}`}>
                {aiCategory.toUpperCase()}
              </Badge>
            )}
            {devRelevance && devRelevance >= 4 && (
              <Badge variant="outline" className="text-xs">
                ⭐ {devRelevance}/5
              </Badge>
            )}
          </div>

          <h3 className="font-semibold leading-snug mb-1">
            {titleKo || title}
          </h3>

          {summaryKo && (
            <p className="text-sm text-muted-foreground line-clamp-2 mb-1.5">
              {summaryKo}
            </p>
          )}

          {devNote && (
            <p className="text-sm text-primary/80 italic mb-1.5">
              💬 {devNote}
            </p>
          )}

          <div className="text-xs text-muted-foreground">
            {displayAuthors}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
