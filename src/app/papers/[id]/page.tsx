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
  const _categoryList = JSON.parse(paper.categories) as string[];

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
        {paper.tags && (() => {
          const tagList = JSON.parse(paper.tags) as string[];
          return tagList.map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
          ));
        })()}
        {paper.devRelevance && (
          <Badge variant="outline">
            관련도: {paper.devRelevance}/5
            {paper.devRelevance === 5 && ' (바로 적용)'}
            {paper.devRelevance === 4 && ' (설정 변경)'}
            {paper.devRelevance === 3 && ' (참고)'}
          </Badge>
        )}
        <BookmarkButton paperId={paper.id} />
      </div>

      <div className="flex gap-3 text-sm">
        {paper.source === 'hacker_news' ? (
          <Link href={paper.arxivUrl} target="_blank" className="text-blue-500 hover:underline">
            원문
          </Link>
        ) : (
          <>
            <Link href={paper.arxivUrl} target="_blank" className="text-blue-500 hover:underline">
              arXiv
            </Link>
            {paper.pdfUrl && (
              <Link href={paper.pdfUrl} target="_blank" className="text-blue-500 hover:underline">
                PDF
              </Link>
            )}
          </>
        )}
      </div>

      <div className="text-sm text-muted-foreground">
        <span>{authorList.join(', ')}</span>
        <span className="mx-2">·</span>
        <span>{new Date(paper.publishedAt).toLocaleDateString('ko-KR')}</span>
      </div>

      {paper.oneLiner && (
        <p className="text-lg font-medium text-amber-700 dark:text-amber-400">
          {paper.oneLiner}
        </p>
      )}

      {paper.targetAudience && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">누가 읽으면 좋은지</h2>
          <p className="leading-relaxed">{paper.targetAudience}</p>
        </section>
      )}

      {paper.keyFindings && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">주요 내용</h2>
          <ul className="space-y-1.5">
            {paper.keyFindings.split('\n').filter(l => l.trim()).map((line, i) => (
              <li key={i} className="leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line.replace(/^-\s*/, '')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {paper.evidence && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">근거</h2>
          <ul className="space-y-1.5">
            {paper.evidence.split('\n').filter(l => l.trim()).map((line, i) => (
              <li key={i} className="leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line.replace(/^-\s*/, '')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {paper.howToApply && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">적용 방법</h2>
          <ul className="space-y-1.5">
            {paper.howToApply.split('\n').filter(l => l.trim()).map((line, i) => (
              <li key={i} className="leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line.replace(/^-\s*/, '')}
              </li>
            ))}
          </ul>
        </section>
      )}

      {paper.codeExample && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">바로 써보기</h2>
          <pre className="overflow-x-auto rounded-lg bg-muted p-4 text-sm"><code>{paper.codeExample}</code></pre>
        </section>
      )}

      {paper.relatedResources && (() => {
        const resources = JSON.parse(paper.relatedResources) as string[];
        return resources.length > 0 ? (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">관련 리소스</h2>
            <ul className="list-disc list-inside space-y-1">
              {resources.map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline break-all">
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null;
      })()}

      {paper.glossary && (() => {
        const terms = JSON.parse(paper.glossary) as Record<string, string>;
        return Object.keys(terms).length > 0 ? (
          <section className="space-y-2">
            <h2 className="text-lg font-semibold">용어 사전</h2>
            <dl className="space-y-2">
              {Object.entries(terms).map(([term, desc]) => (
                <div key={term} className="rounded-lg bg-muted/50 p-3">
                  <dt className="font-mono font-semibold text-sm">{term}</dt>
                  <dd className="text-sm text-muted-foreground mt-1">{desc}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null;
      })()}

      {paper.source !== 'hacker_news' && (
        <section className="space-y-2">
          <h2 className="text-lg font-semibold">Abstract</h2>
          <p className="leading-relaxed text-muted-foreground">{paper.abstract}</p>
        </section>
      )}
    </article>
  );
}
