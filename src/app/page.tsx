import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, and, eq, not, isNotNull } from "drizzle-orm";
import { PaperFeed } from "@/components/paper-feed";
import { NewsletterForm } from "@/components/newsletter-form";
import type { PaperListItem } from "@/lib/types";

export const revalidate = 3600;

interface Props {
  searchParams: Promise<{ category?: string; source?: string }>;
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  const source = params.source;
  const category = params.category;

  const conditions = [];
  conditions.push(isNotNull(papers.summarizedAt));

  if (source === 'community') {
    conditions.push(eq(papers.source, 'hacker_news'));
  } else if (source === 'papers') {
    conditions.push(not(eq(papers.source, 'hacker_news')));
  }

  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
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
  }).from(papers)
    .where(and(...conditions))
    .orderBy(desc(papers.publishedAt))
    .limit(20);

  return (
    <div className="w-full max-w-[800px] flex flex-col px-4 sm:px-6 py-6">
      <PaperFeed
        initialPapers={items}
        initialSource={source || 'all'}
        initialCategory={category || 'all'}
      />
      <NewsletterForm />
    </div>
  );
}
