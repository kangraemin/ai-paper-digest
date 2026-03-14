import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, eq, and, gte } from "drizzle-orm";
import { PaperCard } from "@/components/paper-card";
import { CategoryFilter } from "@/components/category-filter";
import { NewsletterForm } from "@/components/newsletter-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

function formatDateHeader(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return '오늘';
  if (date.toDateString() === yesterday.toDateString()) return '어제';

  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${weekdays[date.getDay()]})`;
}

function groupByDate(items: (typeof papers.$inferSelect)[]): Record<string, (typeof papers.$inferSelect)[]> {
  const groups: Record<string, (typeof papers.$inferSelect)[]> = {};
  for (const item of items) {
    const date = item.publishedAt.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
}

async function TimelineFeed({ category }: { category?: string }) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const conditions = [];
  conditions.push(gte(papers.publishedAt, sevenDaysAgo.toISOString().split('T')[0]));
  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
  }

  const items = await db.select().from(papers)
    .where(and(...conditions))
    .orderBy(desc(papers.publishedAt))
    .limit(100);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        최근 7일 내 논문이 없습니다. 수집을 실행해주세요.
      </div>
    );
  }

  const grouped = groupByDate(items);

  return (
    <div className="space-y-8">
      {Object.entries(grouped).map(([date, datePapers]) => (
        <section key={date}>
          <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-border" />
              <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                {formatDateHeader(date)} · {datePapers.length}편
              </span>
              <div className="h-px flex-1 bg-border" />
            </div>
          </div>
          <div className="space-y-3">
            {datePapers.map(paper => (
              <PaperCard
                key={paper.id}
                id={paper.id}
                title={paper.title}
                titleKo={paper.titleKo}
                summaryKo={paper.summaryKo}
                aiCategory={paper.aiCategory}
                devRelevance={paper.devRelevance}
                devNote={paper.devNote}
                isHot={paper.isHot}
                publishedAt={paper.publishedAt}
                authors={paper.authors}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

async function HotPapers() {
  const hotItems = await db.select().from(papers)
    .where(eq(papers.isHot, true))
    .orderBy(desc(papers.publishedAt))
    .limit(5);

  if (hotItems.length === 0) return null;

  return (
    <section className="space-y-3">
      <h2 className="text-lg font-semibold">🔥 핫 논문</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {hotItems.map((paper) => (
          <PaperCard
            key={paper.id}
            id={paper.id}
            title={paper.title}
            titleKo={paper.titleKo}
            summaryKo={paper.summaryKo}
            aiCategory={paper.aiCategory}
            devRelevance={paper.devRelevance}
            devNote={paper.devNote}
            isHot={paper.isHot}
            publishedAt={paper.publishedAt}
            authors={paper.authors}
          />
        ))}
      </div>
    </section>
  );
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense>
        <HotPapers />
      </Suspense>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">최근 논문</h1>
      </div>
      <Suspense><CategoryFilter /></Suspense>
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">로딩 중...</div>}>
        <TimelineFeed category={params.category} />
      </Suspense>
      <NewsletterForm />
    </div>
  );
}
