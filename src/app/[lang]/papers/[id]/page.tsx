export const revalidate = 0;

import type { Metadata } from 'next';
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { BookmarkButton } from '@/components/bookmark-button';
import { CopyButton } from '@/components/copy-button';
import { getLocalizedField } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';
import Link from 'next/link';
import { Calendar, Users, FileText, Zap, ChevronDown } from 'lucide-react';
import { PaperViewTracker } from '@/components/paper-view-tracker';
import { TrackedExternalLink } from '@/components/tracked-external-link';

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
  params: Promise<{ lang: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, lang } = await params;
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';
  const result = await db.select({
    title: papers.title,
    titleKo: papers.titleKo,
    oneLiner: papers.oneLiner,
    oneLinerEn: papers.oneLinerEn,
    abstract: papers.abstract,
    publishedAt: papers.publishedAt,
    authors: papers.authors,
    aiCategory: papers.aiCategory,
  }).from(papers).where(eq(papers.id, id)).limit(1);

  if (result.length === 0) return {};
  const paper = result[0];
  const title = lang === 'en' ? paper.title : (paper.titleKo || paper.title);
  const description = (lang === 'en' ? paper.oneLinerEn : paper.oneLiner) || paper.abstract?.slice(0, 160) || '';
  const authorList = JSON.parse(paper.authors || '[]') as string[];

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang}/papers/${id}`,
      languages: {
        'ko-KR': `${BASE}/ko/papers/${id}`,
        'en-US': `${BASE}/en/papers/${id}`,
      },
    },
    openGraph: {
      title,
      description,
      type: 'article',
      url: `${BASE}/${lang}/papers/${id}`,
      siteName: 'AI Paper Digest',
      locale: lang === 'en' ? 'en_US' : 'ko_KR',
      publishedTime: paper.publishedAt,
      authors: authorList.slice(0, 3),
      tags: paper.aiCategory ? [paper.aiCategory] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function PaperDetail({ params }: Props) {
  const { id, lang: langParam } = await params;
  const lang = langParam as Lang;
  const result = await db.select().from(papers).where(eq(papers.id, id)).limit(1);

  if (result.length === 0) notFound();
  const paper = result[0];
  const authorList = JSON.parse(paper.authors) as string[];
  const catColor = paper.aiCategory ? (categoryColorMap[paper.aiCategory] ?? '#888') : '#888';
  const catName = paper.aiCategory ? (categoryDisplayName[paper.aiCategory] ?? paper.aiCategory) : null;
  const displayTitle = lang === 'en' ? paper.title : (paper.titleKo || paper.title);
  const lf = (ko: string | null, en: string | null) => getLocalizedField(ko, en, lang);
  const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ScholarlyArticle',
    headline: displayTitle,
    description: lf(paper.oneLiner, paper.oneLinerEn) || paper.abstract?.slice(0, 200) || '',
    datePublished: paper.publishedAt,
    author: authorList.map((name) => ({ '@type': 'Person', name })),
    publisher: {
      '@type': 'Organization',
      name: 'AI Paper Digest',
      url: BASE,
    },
    url: `${BASE}/${lang}/papers/${paper.id}`,
    inLanguage: lang === 'ko' ? 'ko' : 'en',
    ...(paper.arxivUrl ? { sameAs: paper.arxivUrl } : {}),
  };
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${BASE}/${lang}`,
      },
      ...(catName ? [{
        '@type': 'ListItem',
        position: 2,
        name: catName,
      }] : []),
      {
        '@type': 'ListItem',
        position: catName ? 3 : 2,
        name: displayTitle,
      },
    ],
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
    <article className="w-full max-w-[768px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <PaperViewTracker paperId={paper.id} source={paper.source} category={paper.aiCategory} lang={lang} />
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-6 font-mono text-[12px] text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground transition-colors">Home</Link>
        <span>/</span>
        {catName && (
          <>
            <span style={{ color: catColor }}>{catName}</span>
            <span>/</span>
          </>
        )}
        <span className="text-foreground truncate max-w-[160px] sm:max-w-[300px]">{displayTitle}</span>
      </nav>

      {/* Title */}
      <h1 className="text-foreground text-[24px] md:text-[28px] font-semibold leading-tight tracking-tight mb-4">
        {displayTitle}
      </h1>
      {lang !== 'en' && paper.titleKo && (
        <p className="text-[13px] text-muted-foreground mb-4">{paper.title}</p>
      )}

      {/* Meta Row */}
      <div className="flex flex-wrap items-center gap-y-2 text-[13px] text-muted-foreground mb-8">
        <span className="flex items-center gap-1.5 mr-4">
          <Calendar size={16} />
          {new Date(paper.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
        </span>
        <span className="flex items-center gap-1.5 mr-4">
          <span className="text-muted-foreground">&bull;</span>
          <Users size={16} />
          {authorList.slice(0, 3).join(', ')}{authorList.length > 3 ? ` +${authorList.length - 3}` : ''}
        </span>
        <span className="flex items-center gap-1.5 mr-4">
          <span className="text-muted-foreground">&bull;</span>
          {(paper.source === 'hacker_news' || paper.source === 'reddit') ? (
            <TrackedExternalLink href={paper.arxivUrl} paperId={paper.id} source={paper.source} label="arxiv" className="flex items-center gap-1.5 text-blue-400 hover:underline">
              <FileText size={16} />
              View Original
            </TrackedExternalLink>
          ) : (
            <TrackedExternalLink href={paper.pdfUrl || paper.arxivUrl} paperId={paper.id} source={paper.source} label="pdf" className="flex items-center gap-1.5 text-blue-400 hover:underline">
              <FileText size={16} />
              View PDF
            </TrackedExternalLink>
          )}
        </span>
        <BookmarkButton paperId={paper.id} lang={lang} />
      </div>

      {/* TL;DR Highlight */}
      {lf(paper.oneLiner, paper.oneLinerEn) && (
        <section className="mb-10 bg-highlight-bg border-l-[3px] border-highlight-border rounded-r-sm p-4">
          <div className="flex gap-3 items-start">
            <Zap className="text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h3 className="font-mono text-[11px] uppercase tracking-wide text-amber-500/80 mb-1">TL;DR Highlight</h3>
              <p className="text-[15px] text-foreground leading-relaxed font-medium">{lf(paper.oneLiner, paper.oneLinerEn)}</p>
            </div>
          </div>
        </section>
      )}

      {/* Who Should Read */}
      {lf(paper.targetAudience, paper.targetAudienceEn) && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
            Who Should Read
          </h3>
          <p className="text-[14px] text-muted-foreground leading-relaxed">{lf(paper.targetAudience, paper.targetAudienceEn)}</p>
        </section>
      )}

      {/* Key Points */}
      {lf(paper.keyFindings, paper.keyFindingsEn) && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
            Core Mechanics
          </h3>
          <ul className="space-y-2">
            {parseBulletList(lf(paper.keyFindings, paper.keyFindingsEn)!).map((line, i) => (
              <li key={i} className="text-[14px] text-muted-foreground leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Evidence */}
      {lf(paper.evidence, paper.evidenceEn) && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
            Evidence
          </h3>
          <ul className="space-y-2">
            {parseBulletList(lf(paper.evidence, paper.evidenceEn)!).map((line, i) => (
              <li key={i} className="text-[14px] text-muted-foreground leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* How to Apply */}
      {lf(paper.howToApply, paper.howToApplyEn) && (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
            How to Apply
          </h3>
          <ul className="space-y-2">
            {parseBulletList(lf(paper.howToApply, paper.howToApplyEn)!).map((line, i) => (
              <li key={i} className="text-[14px] text-muted-foreground leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-muted-foreground">
                {line}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Code Example */}
      {(paper.codeExample || paper.codeExampleEn) && (() => {
        const code = lang === 'en' ? (paper.codeExampleEn || paper.codeExample) : paper.codeExample;
        return code ? (
        <section className="mb-10">
          <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
            Code Example
          </h3>
          <div className="relative rounded-sm border border-border bg-muted overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border">
              <span className="font-mono text-[12px] text-muted-foreground">snippet</span>
              <CopyButton text={code} />
            </div>
            <div className="p-4 overflow-x-auto">
              <pre className="font-mono text-[13px] leading-relaxed text-foreground/80"><code>{code}</code></pre>
            </div>
          </div>
        </section>
        ) : null;
      })()}

      {/* Terminology */}
      {(paper.glossary || paper.glossaryEn) && (() => {
        try {
          const src = lang === 'en' ? (paper.glossaryEn || paper.glossary) : paper.glossary;
          const parsed = JSON.parse(src!);
          // 두 가지 포맷 처리: {key: string} 또는 [{term, definition}]
          const entries: [string, string][] = Array.isArray(parsed)
            ? parsed.map((item: { term: string; definition: string }) => [item.term, item.definition])
            : Object.entries(parsed as Record<string, string>);
          if (entries.length === 0) return null;
          return (
            <section className="mb-10">
              <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
                Terminology
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                {entries.map(([term, desc]) => (
                  <div key={term} className="flex flex-col gap-1">
                    <span className="font-mono text-[13px] text-foreground">{term}</span>
                    <span className="text-[13px] text-muted-foreground">{desc}</span>
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
      {(paper.relatedResources || paper.relatedResourcesEn) && (() => {
        try {
          const src = lang === 'en' ? (paper.relatedResourcesEn || paper.relatedResources) : paper.relatedResources;
          const raw = JSON.parse(src!) as (string | { title?: string; url: string })[];
          const resources = raw.map(r => typeof r === 'string' ? { title: r, url: r } : { title: r.title || r.url, url: r.url });
          if (resources.length === 0) return null;
          return (
            <section className="mb-10">
              <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
                Related Resources
              </h3>
              <ul className="space-y-2">
                {resources.map((r, i) => (
                  <li key={i}>
                    <TrackedExternalLink href={r.url} paperId={paper.id} source={paper.source} label="related_resource" className="text-[13px] text-blue-400 hover:underline break-all">
                      {r.title}
                    </TrackedExternalLink>
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
      {!['hacker_news', 'reddit'].includes(paper.source ?? '') && paper.abstract && (
        <section className="mb-10">
          <details className="group">
            <summary className="flex items-center justify-between text-[14px] font-semibold text-muted-foreground hover:text-foreground uppercase tracking-wide cursor-pointer">
              <span>Original Abstract (Expand)</span>
              <ChevronDown size={16} className="transition-transform group-open:rotate-180" />
            </summary>
            <div className="mt-4 p-4 bg-card border border-border rounded-sm">
              <p className="text-[13px] text-muted-foreground leading-relaxed">{paper.abstract}</p>
            </div>
          </details>
        </section>
      )}
    </article>
    </>
  );
}
