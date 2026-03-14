import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { HotBadge } from '@/components/hot-badge';
import { BookmarkButton } from '@/components/bookmark-button';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaperDetail({ params }: Props) {
  const { id } = await params;
  const result = await db.select().from(papers).where(eq(papers.id, id)).limit(1);

  if (result.length === 0) notFound();
  const paper = result[0];
  const authorList = JSON.parse(paper.authors) as string[];
  const categoryList = JSON.parse(paper.categories) as string[];

  return (
    <article className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <h1 className="text-2xl font-bold">{paper.titleKo || paper.title}</h1>
          {paper.isHot && <HotBadge />}
        </div>
        {paper.titleKo && (
          <p className="text-sm text-muted-foreground">{paper.title}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {paper.aiCategory && (
          <Badge variant="secondary">{paper.aiCategory.toUpperCase()}</Badge>
        )}
        {categoryList.map(cat => (
          <Badge key={cat} variant="outline">{cat}</Badge>
        ))}
        {paper.devRelevance && (
          <Badge variant="outline">관련도: {paper.devRelevance}/5</Badge>
        )}
        <BookmarkButton paperId={paper.id} />
      </div>

      <div className="flex gap-3 text-sm">
        <Link href={paper.arxivUrl} target="_blank" className="text-blue-500 hover:underline">
          arXiv
        </Link>
        <Link href={paper.pdfUrl} target="_blank" className="text-blue-500 hover:underline">
          PDF
        </Link>
      </div>

      <div className="text-sm text-muted-foreground">
        <span>{authorList.join(', ')}</span>
        <span className="mx-2">·</span>
        <span>{new Date(paper.publishedAt).toLocaleDateString('ko-KR')}</span>
      </div>

      {paper.summaryKo && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">한글 요약</h2>
          <p className="leading-relaxed">{paper.summaryKo}</p>
        </section>
      )}

      <section className="space-y-2">
        <h2 className="text-lg font-semibold">Abstract</h2>
        <p className="leading-relaxed text-muted-foreground">{paper.abstract}</p>
      </section>
    </article>
  );
}
