export const revalidate = 3600;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { and, desc, eq, isNotNull } from 'drizzle-orm';
import { CATEGORY_SLUGS, CATEGORY_NAME, CATEGORY_COLOR, isCategorySlug } from '@/lib/category';
import type { Lang } from '@/lib/i18n';
import { SUPPORTED_LANGS } from '@/lib/i18n';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    CATEGORY_SLUGS.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isCategorySlug(slug)) return {};
  const name = CATEGORY_NAME[slug] ?? slug;
  const isKo = lang === 'ko';
  const title = isKo ? `${name} 논문 — AI Paper Digest` : `${name} Papers — AI Paper Digest`;
  const description = isKo
    ? `${name} 카테고리의 최신 AI/LLM 논문 한글 요약 모음.`
    : `Latest AI/LLM ${name} papers summarized.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang}/categories/${slug}`,
      languages: {
        'ko-KR': `${BASE}/ko/categories/${slug}`,
        'en-US': `${BASE}/en/categories/${slug}`,
        'x-default': `${BASE}/en/categories/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${lang}/categories/${slug}`,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'AI Paper Digest' }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  if (!isCategorySlug(slug)) notFound();
  const name = CATEGORY_NAME[slug] ?? slug;
  const color = CATEGORY_COLOR[slug] ?? '#888';

  const items = await db.select({
    id: papers.id,
    title: papers.title,
    titleKo: papers.titleKo,
    oneLiner: papers.oneLiner,
    oneLinerEn: papers.oneLinerEn,
    publishedAt: papers.publishedAt,
    aiCategory: papers.aiCategory,
  })
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), eq(papers.aiCategory, slug)))
    .orderBy(desc(papers.publishedAt))
    .limit(50);

  return (
    <article className="w-full max-w-[800px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <nav className="flex items-center gap-2 mb-6 font-mono text-[12px] text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span style={{ color }}>{name}</span>
      </nav>
      <h1 className="text-foreground text-[24px] md:text-[28px] font-semibold mb-2">{name}</h1>
      <p className="text-[13px] text-muted-foreground mb-8">
        {lang === 'en'
          ? `Latest ${items.length} papers in ${name}.`
          : `${name} 카테고리 최신 ${items.length}편.`}
      </p>
      {items.length === 0 ? (
        <p className="text-[13px] text-muted-foreground">{lang === 'en' ? 'No papers yet.' : '아직 논문이 없습니다.'}</p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {items.map((p) => {
            const title = lang === 'en' ? (p.title || p.titleKo || '') : (p.titleKo || p.title || '');
            const summary = lang === 'en' ? (p.oneLinerEn || p.oneLiner || '') : (p.oneLiner || p.oneLinerEn || '');
            return (
              <li key={p.id} className="border border-border rounded-sm p-3 hover:border-foreground/40 transition-colors">
                <Link href={`/${lang}/papers/${p.id}`} className="block">
                  <p className="text-[13px] font-semibold text-foreground line-clamp-2 mb-1">{title}</p>
                  {summary && <p className="text-[12px] text-muted-foreground line-clamp-2">{summary}</p>}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </article>
  );
}
