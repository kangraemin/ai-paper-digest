export const revalidate = 3600;

import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { and, desc, isNotNull } from 'drizzle-orm';
import {
  TOPIC_SLUGS,
  TOPIC_NAME_KO,
  TOPIC_NAME_EN,
  TOPIC_COLOR,
  isTopicSlug,
  topicCondition,
} from '@/lib/topics';
import type { Lang } from '@/lib/i18n';
import { SUPPORTED_LANGS } from '@/lib/i18n';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';

export function generateStaticParams() {
  return SUPPORTED_LANGS.flatMap((lang) =>
    TOPIC_SLUGS.map((slug) => ({ lang, slug }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isTopicSlug(slug)) return {};
  const isKo = lang === 'ko';
  const name = (isKo ? TOPIC_NAME_KO : TOPIC_NAME_EN)[slug];
  const title = isKo ? `${name} 논문 — AI Paper Digest` : `${name} Papers — AI Paper Digest`;
  const description = isKo
    ? `${name} 관련 AI/LLM 논문 한글 요약 모음.`
    : `Curated AI/LLM papers on ${name}.`;
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE}/${lang}/topics/${slug}`,
      languages: {
        'ko-KR': `${BASE}/ko/topics/${slug}`,
        'en-US': `${BASE}/en/topics/${slug}`,
        'x-default': `${BASE}/en/topics/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE}/${lang}/topics/${slug}`,
      type: 'website',
      images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'AI Paper Digest' }],
    },
  };
}

export default async function TopicPage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: langParam, slug } = await params;
  const lang = langParam as Lang;
  if (!isTopicSlug(slug)) notFound();
  const name = (lang === 'ko' ? TOPIC_NAME_KO : TOPIC_NAME_EN)[slug];
  const color = TOPIC_COLOR[slug];

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
    .where(and(isNotNull(papers.summarizedAt), topicCondition(slug)))
    .orderBy(desc(papers.publishedAt))
    .limit(60);

  return (
    <article className="w-full max-w-[800px] mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
      <nav className="flex items-center gap-2 mb-6 font-mono text-[12px] text-muted-foreground">
        <Link href={`/${lang}`} className="hover:text-foreground">Home</Link>
        <span>/</span>
        <span className="text-muted-foreground">{lang === 'en' ? 'Topics' : '토픽'}</span>
        <span>/</span>
        <span style={{ color }}>{name}</span>
      </nav>
      <h1 className="text-foreground text-[24px] md:text-[28px] font-semibold mb-2">{name}</h1>
      <p className="text-[13px] text-muted-foreground mb-8">
        {lang === 'en'
          ? `Latest ${items.length} papers on ${name}.`
          : `${name} 관련 최신 ${items.length}편.`}
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
