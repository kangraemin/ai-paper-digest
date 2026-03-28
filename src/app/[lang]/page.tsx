import { Suspense } from 'react';
import type { Metadata } from 'next';
import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, isNotNull, eq, inArray, notInArray, and } from "drizzle-orm";
import { PaperFeed } from "@/components/paper-feed";
import type { PaperListItem } from "@/lib/types";

export const revalidate = 3600;

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'

export async function generateMetadata({
  params: routeParams,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await routeParams
  const isKo = lang === 'ko'
  return {
    title: isKo
      ? 'AI Paper Digest — AI·LLM 논문 매일 한글 요약'
      : 'AI Paper Digest — Daily AI/LLM Paper Summaries',
    description: isKo
      ? '매일 업데이트되는 AI/LLM 논문 한글 요약. arXiv 최신 논문을 Claude가 요약합니다.'
      : 'Daily AI/LLM paper summaries in Korean and English. Latest arXiv papers summarized by Claude.',
    alternates: {
      canonical: `${BASE}/${lang}`,
      languages: {
        'ko-KR': `${BASE}/ko`,
        'en-US': `${BASE}/en`,
      },
    },
    openGraph: {
      title: 'AI Paper Digest',
      description: isKo
        ? '매일 업데이트되는 AI/LLM 논문 한글 요약'
        : 'Daily AI/LLM paper summaries',
      url: `${BASE}/${lang}`,
      siteName: 'AI Paper Digest',
      type: 'website',
      locale: isKo ? 'ko_KR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: isKo ? 'AI Paper Digest — AI·LLM 논문 매일 한글 요약' : 'AI Paper Digest — Daily AI/LLM Paper Summaries',
      description: isKo
        ? '매일 업데이트되는 AI/LLM 논문 한글 요약. arXiv 최신 논문을 Claude가 요약합니다.'
        : 'Daily AI/LLM paper summaries in Korean and English. Latest arXiv papers summarized by Claude.',
    },
  }
}

export default async function Home({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ source?: string; category?: string; q?: string }>;
}) {
  const { lang } = await routeParams;
  const params = await searchParams;
  const sourceFilter = params.source || 'all';
  const categoryFilter = params.category || 'all';

  const conditions = [isNotNull(papers.summarizedAt)];
  const communitySources = ['hacker_news', 'reddit'];
  const paperSources = ['arxiv', 'hugging_face'];
  if (sourceFilter === 'community') {
    conditions.push(inArray(papers.source, communitySources));
  } else if (sourceFilter === 'papers') {
    conditions.push(inArray(papers.source, paperSources));
  }
  if (categoryFilter && categoryFilter !== 'all') {
    conditions.push(eq(papers.aiCategory, categoryFilter));
  }

  const items: PaperListItem[] = await db.select({
    id: papers.id,
    title: papers.title,
    titleKo: papers.titleKo,
    oneLiner: papers.oneLiner,
    oneLinerEn: papers.oneLinerEn,
    aiCategory: papers.aiCategory,
    devRelevance: papers.devRelevance,
    targetAudience: papers.targetAudience,
    tags: papers.tags,
    source: papers.source,
    isHot: papers.isHot,
    publishedAt: papers.publishedAt,
    authors: papers.authors,
    venue: papers.venue,
    affiliations: papers.affiliations,
  }).from(papers)
    .where(and(...conditions))
    .orderBy(desc(papers.publishedAt))
    .limit(20);

  return (
    <div className="w-full max-w-[800px] flex flex-col px-4 sm:px-6 py-6">
      <Suspense fallback={null}>
        <PaperFeed
          initialPapers={items}
          initialSource={sourceFilter}
          initialCategory={categoryFilter}
          lang={lang as 'ko' | 'en'}
        />
      </Suspense>
    </div>
  );
}
