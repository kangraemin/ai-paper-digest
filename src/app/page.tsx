import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, isNotNull } from "drizzle-orm";
import { PaperFeed } from "@/components/paper-feed";
import { NewsletterForm } from "@/components/newsletter-form";
import type { PaperListItem } from "@/lib/types";

export const revalidate = 3600;

export default async function Home() {
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
    .where(isNotNull(papers.summarizedAt))
    .orderBy(desc(papers.publishedAt))
    .limit(20);

  return (
    <div className="w-full max-w-[800px] flex flex-col px-4 sm:px-6 py-6">
      <PaperFeed initialPapers={items} />
      <NewsletterForm />
    </div>
  );
}
