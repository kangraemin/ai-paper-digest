import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
}

export function PaperCard({ id, title, titleKo, summaryKo, aiCategory, devRelevance, isHot, publishedAt, authors }: PaperCardProps) {
  const authorList = JSON.parse(authors) as string[];
  const displayAuthors = authorList.length > 3
    ? `${authorList.slice(0, 3).join(', ')} +${authorList.length - 3}`
    : authorList.join(', ');

  return (
    <Link href={`/papers/${id}`}>
      <Card className="h-full transition-shadow hover:shadow-lg">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base leading-tight">
              {titleKo || title}
            </CardTitle>
            {isHot && <HotBadge />}
          </div>
          <div className="flex items-center gap-2 pt-1">
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
        </CardHeader>
        <CardContent>
          {summaryKo && (
            <p className="mb-2 line-clamp-3 text-sm text-muted-foreground">
              {summaryKo}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{displayAuthors}</span>
            <span>{new Date(publishedAt).toLocaleDateString('ko-KR')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
