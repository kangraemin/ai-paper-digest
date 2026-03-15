import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/bookmark-button';
import { CopyButton } from '@/components/copy-button';
import Link from 'next/link';
import { Calendar, Users, FileText, Zap, ChevronDown } from 'lucide-react';

function parseBulletList(value: string): string[] {
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) return arr;
  } catch {}
  if (value.includes(',- ')) {
    return value.split(',- ').map(l => l.replace(/^-\s*/, '').trim()).filter(Boolean);
  }
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}

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

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PaperDetail({ params }: Props) {
  const { id } = await params;
  const result = await db.select().from(papers).where(eq(papers.id, id)).limit(1);

  if (result.length === 0) notFound();
  const paper = result[0];
  const authorList = JSON.parse(paper.authors) as string[];
  const catColor = paper.aiCategory ? (categoryColorMap[paper.aiCategory] ?? '#888') : '#888';
  const catName = paper.aiCategory ? (categoryDisplayName[paper.aiCategory] ?? paper.aiCategory) : null;
  const displayTitle = paper.titleKo || paper.title;

  return (
    <article className="max-w-[768px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-6 font-mono text-[12px] text-zinc-500">
        <Link href="/" className="hover:text-zinc-100 transition-colors">Home</Link>
        <span>/</span>
        {catName && (
          <>
            <span style={{ color: catColor }}>{catName}</span>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-100 truncate max-w-[160px] sm:max-w-[300px]">{displayTitle}</span>
      </nav>

      {/* Title */}
      <h1 className="text-zinc-100 text-[24px] md:text-[28px] font-semibold leading-tight tracking-tight mb-4">
        {displayTitle}
      </h1>
      {paper.titleKo && (
        <p className="text-[13px] text-zinc-500 mb-4">{paper.title}</p>
      )}

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] text-zinc-500 mb-8">
        <span className="flex items-center gap-1.5">
          <Calendar size={16} />
          {new Date(paper.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <span className="text-zinc-700">&bull;</span>
        <span className="flex items-center gap-1.5">
          <Users size={16} />
          {authorList.slice(0, 3).join(', ')}{authorList.length > 3 ? ` +${authorList.length - 3}` : ''}
        </span>
        <span className="text-zinc-700">&bull;</span>
        {paper.source === 'hacker_news' ? (
          <Link href={paper.arxivUrl} target="_blank" className="flex items-center gap-1.5 text-blue-400 hover:underline">
            <FileText size={16} />
            View Original
          </Link>
        ) : (
          <Link href={paper.pdfUrl || paper.arxivUrl} target="_blank" className="flex items-center gap-1.5 text-blue-400 hover:underline">
            <FileText size={16} />
            View PDF
          </Link>
        )}
        <BookmarkButton paperId={paper.id} />
      </div>

      {/* TL;DR Highlight */}
      {paper.oneLiner && (
        <section className="mb-10 bg-highlight-bg/30 border-l-[3px] border-highlight-border rounded-r-sm p-4">
          <div className="flex gap-3 items-start">
            <Zap className="text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wide text-amber-500/80 mb-1">TL;DR Highlight</h3>
              <p className="text-[15px] text-amber-100/90 leading-relaxed font-medium">{paper.oneLiner}</p>
            </div>
          </div>
        </section>
      )}

      {/* Who Should Read */}
      {paper.targetAudience && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
            Who Should Read
          </h3>
          <p className="text-[14px] text-zinc-400 leading-relaxed">{paper.targetAudience}</p>
        </section>
      )}

      {/* Key Points */}
      {paper.keyFindings && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
            Core Mechanics
          </h3>
          <ul className="space-y-2">
            {parseBulletList(paper.keyFindings).map((line, i) => (
              <li key={i} className="text-[14px] text-zinc-400 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-600">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Evidence */}
      {paper.evidence && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
            Evidence
          </h3>
          <ul className="space-y-2">
            {parseBulletList(paper.evidence).map((line, i) => (
              <li key={i} className="text-[14px] text-zinc-400 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-600">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to Apply */}
      {paper.howToApply && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
            How to Apply
          </h3>
          <ul className="space-y-2">
            {parseBulletList(paper.howToApply).map((line, i) => (
              <li key={i} className="text-[14px] text-zinc-400 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-zinc-600">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Code Example */}
      {paper.codeExample && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
            Code Example
          </h3>
          <div className="relative rounded-sm border border-zinc-800 bg-[#0d0d0f] overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-zinc-800">
              <span className="font-mono text-[12px] text-zinc-500">snippet</span>
              <CopyButton text={paper.codeExample} />
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-[13px] leading-relaxed text-zinc-300"><code>{paper.codeExample}</code></pre>
            </div>
          </div>
        </section>
      )}

      {/* Terminology */}
      {paper.glossary && (() => {
        try {
          const terms = JSON.parse(paper.glossary) as Record<string, string>;
          if (Object.keys(terms).length === 0) return null;
          return (
            <section className="mb-10">
              <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
                Terminology
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(terms).map(([term, desc]) => (
                  <div key={term} className="flex flex-col gap-1">
                    <span className="font-mono text-[13px] text-zinc-100">{term}</span>
                    <span className="text-[13px] text-zinc-500">{desc}</span>
                  </div>
                ))}
              </div>
            </section>
          );
        } catch {
          return null;
        }
      })()}

      {/* Related Resources */}
      {paper.relatedResources && (() => {
        try {
          const resources = JSON.parse(paper.relatedResources) as string[];
          if (resources.length === 0) return null;
          return (
            <section className="mb-10">
              <h3 className="text-[14px] font-semibold text-zinc-100 uppercase tracking-wide border-b border-zinc-800 pb-2 mb-4">
                Related Resources
              </h3>
              <ul className="space-y-2">
                {resources.map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-[13px] text-blue-400 hover:underline break-all">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          );
        } catch {
          return null;
        }
      })()}

      {/* Collapsible Abstract */}
      {paper.source !== 'hacker_news' && paper.abstract && (
        <section className="mb-10">
          <details className="group">
            <summary className="flex items-center justify-between text-[14px] font-semibold text-zinc-500 hover:text-zinc-100 uppercase tracking-wide cursor-pointer">
              <span>Original Abstract (Expand)</span>
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 p-4 bg-zinc-900 border border-zinc-800 rounded-sm">
              <p className="text-[13px] text-zinc-400 leading-relaxed">{paper.abstract}</p>
            </div>
          </details>
        </section>
      )}
    </article>
  );
}
