import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, eq, and, gte, lt } from "drizzle-orm";
import { PaperCard } from "@/components/paper-card";
import { CategoryFilter } from "@/components/category-filter";
import { DateNav } from "@/components/date-nav";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ date?: string; category?: string; page?: string }>;
}

async function PaperGrid({ date, category, page }: { date?: string; category?: string; page?: string }) {
  const conditions = [];

  if (date) {
    const nextDay = new Date(date + "T00:00:00Z");
    nextDay.setUTCDate(nextDay.getUTCDate() + 1);
    conditions.push(gte(papers.publishedAt, date));
    conditions.push(lt(papers.publishedAt, nextDay.toISOString().split("T")[0]));
  }

  if (category && category !== "all") {
    conditions.push(eq(papers.aiCategory, category));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;
  const pageNum = Math.max(1, Number(page || "1"));
  const limit = 20;
  const offset = (pageNum - 1) * limit;

  const items = await db.select().from(papers)
    .where(where)
    .orderBy(desc(papers.publishedAt))
    .limit(limit)
    .offset(offset);

  if (items.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        해당 조건의 논문이 없습니다.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((paper) => (
        <PaperCard
          key={paper.id}
          id={paper.id}
          title={paper.title}
          titleKo={paper.titleKo}
          summaryKo={paper.summaryKo}
          aiCategory={paper.aiCategory}
          devRelevance={paper.devRelevance}
          isHot={paper.isHot}
          publishedAt={paper.publishedAt}
          authors={paper.authors}
        />
      ))}
    </div>
  );
}

export default async function Home({ searchParams }: Props) {
  const params = await searchParams;
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">오늘의 논문</h1>
        <Suspense><DateNav /></Suspense>
      </div>
      <Suspense><CategoryFilter /></Suspense>
      <Suspense fallback={<div className="py-12 text-center text-muted-foreground">로딩 중...</div>}>
        <PaperGrid date={params.date} category={params.category} page={params.page} />
      </Suspense>
    </div>
  );
}
