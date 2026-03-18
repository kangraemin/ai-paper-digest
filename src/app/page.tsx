import { Suspense } from 'react';
import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, isNotNull, eq, inArray, notInArray, and } from "drizzle-orm";
import { PaperFeed } from "@/components/paper-feed";
import type { PaperListItem } from "@/lib/types";

export const revalidate = 3600;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ source?: string; category?: string; q?: string }>;
}) {
  const params = await searchParams;
  const sourceFilter = params.source || 'all';
  const categoryFilter = params.category || 'all';

  const conditions = [isNotNull(papers.summarizedAt)];
  const communitySources = ['hacker_news', 'reddit'];
  const paperSources = ['arxiv', 'semantic_scholar', 'papers_with_code'];
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
        />
      </Suspense>
    </div>
  );
}
