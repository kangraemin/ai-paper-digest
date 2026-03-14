import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, and, gte, eq } from "drizzle-orm";
import { PaperCard } from "@/components/paper-card";
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
      <div className="py-20 text-center">
        <p className="text-4xl mb-4">¯\_(ツ)_/¯</p>
        <p className="text-muted-foreground">오늘은 조용한 날이네요.</p>
        <p className="text-sm text-muted-foreground mt-1">논문 수집을 실행하거나 내일 다시 확인해 주세요.</p>
      </div>
    );
  }

  const grouped = groupByDate(items);

  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => (b.devRelevance ?? 0) - (a.devRelevance ?? 0));
  }

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
                oneLiner={paper.oneLiner}
                aiCategory={paper.aiCategory}
                devRelevance={paper.devRelevance}
                targetAudience={paper.targetAudience}
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

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">로딩 중...</div>}>
        <TimelineFeed category={params.category} />
      </Suspense>
      <NewsletterForm />
    </div>
  );
}
