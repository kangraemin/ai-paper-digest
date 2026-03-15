# 홈페이지 성능 최적화 + 페이징

## 변경 파일별 상세

### `src/lib/types.ts` (신규)
- **용도**: `PaperListItem` 공유 타입 정의
- **핵심 코드**:
```ts
export type PaperListItem = {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  aiCategory: string | null;
  devRelevance: number | null;
  targetAudience: string | null;
  tags: string | null;
  source: string | null;
  isHot: boolean | null;
  publishedAt: string;
  authors: string;
};
```

### `src/app/page.tsx`
- **변경 이유**: `force-dynamic` 제거, 컬럼 프로젝션, PaperFeed로 위임
- **Before**:
```ts
import { db } from "@/lib/db";
import { papers } from "@/lib/db/schema";
import { desc, and, eq, not, isNotNull } from "drizzle-orm";
import { PaperCard } from "@/components/paper-card";
import { SourceTabs } from "@/components/source-tabs";
import { CategoryChips } from "@/components/category-chips";
import { NewsletterForm } from "@/components/newsletter-form";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string; source?: string }>;
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

async function TimelineFeed({ category, source }: { category?: string; source?: string }) {
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

  const items = await db.select().from(papers)
    .where(and(...conditions))
    .orderBy(desc(papers.publishedAt))
    .limit(100);

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-4xl mb-4">¯\_(ツ)_/¯</p>
        <p className="text-zinc-400">오늘은 조용한 날이네요.</p>
        <p className="text-sm text-zinc-500 mt-1">
          {source === 'community' ? 'HN 수집을 실행하거나 내일 다시 확인해 주세요.' : '논문 수집을 실행하거나 내일 다시 확인해 주세요.'}
        </p>
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
          <div className="sticky top-0 z-10 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/60 py-2 mb-4">
            <h2 className="font-mono text-[12px] text-zinc-500 uppercase tracking-wider mb-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />
              {formatDateHeader(date)} · {datePapers.length}편
            </h2>
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
                tags={paper.tags}
                source={paper.source}
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
    <div className="w-full max-w-[800px] flex flex-col px-4 sm:px-6 py-6">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <SourceTabs />
        <div className="mt-4">
          <CategoryChips />
        </div>
      </div>
      <Suspense fallback={<div className="py-12 text-center text-zinc-400">로딩 중...</div>}>
        <TimelineFeed category={params.category} source={params.source} />
      </Suspense>
      <NewsletterForm />
    </div>
  );
}
```
- **After**:
```ts
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
```
- **영향 범위**: PaperFeed, SourceTabs, CategoryChips

### `src/components/paper-feed.tsx` (신규)
- **용도**: 클라이언트 컨테이너 — 필터 상태 관리, API fetch, Load More, 날짜 그루핑
- **핵심 코드**:
```tsx
'use client';

import { useState, useEffect, useCallback } from 'react';
import { SourceTabs } from './source-tabs';
import { CategoryChips } from './category-chips';
import { PaperCard } from './paper-card';
import type { PaperListItem } from '@/lib/types';

function formatDateHeader(dateStr: string): string { /* 기존 로직 */ }
function groupByDate(items: PaperListItem[]): Record<string, PaperListItem[]> { /* 기존 로직 */ }

interface PaperFeedProps {
  initialPapers: PaperListItem[];
  initialSource: string;
  initialCategory: string;
}

export function PaperFeed({ initialPapers, initialSource, initialCategory }: PaperFeedProps) {
  const [allPapers, setAllPapers] = useState(initialPapers);
  const [source, setSource] = useState(initialSource);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPapers.length >= 20);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const isInitialRender = useRef(true);

  // 필터 변경 시 fetch
  useEffect(() => {
    if (isInitialRender.current) { isInitialRender.current = false; return; }
    const params = new URLSearchParams();
    if (source !== 'all') params.set('source', source);
    if (category !== 'all') params.set('category', category);
    window.history.replaceState(null, '', params.toString() ? `/?${params}` : '/');

    setLoading(true);
    setPage(1);
    fetch(`/api/papers?${params}&limit=20`)
      .then(r => r.json())
      .then(data => {
        setAllPapers(data.papers);
        setHasMore(data.hasMore);
        setLoading(false);
      });
  }, [source, category]);

  // Load More
  const loadMore = useCallback(async () => {
    setLoadingMore(true);
    const nextPage = page + 1;
    const params = new URLSearchParams();
    if (source !== 'all') params.set('source', source);
    if (category !== 'all') params.set('category', category);
    params.set('page', String(nextPage));
    params.set('limit', '20');

    const data = await fetch(`/api/papers?${params}`).then(r => r.json());
    setAllPapers(prev => [...prev, ...data.papers]);
    setHasMore(data.hasMore);
    setPage(nextPage);
    setLoadingMore(false);
  }, [page, source, category]);

  // 렌더링: 날짜 그루핑 + devRelevance 정렬 + PaperCard
  // 빈 상태, 로딩 상태, "더 보기" 버튼 포함
}
```

### `src/components/source-tabs.tsx`
- **변경 이유**: controlled props 전환
- **Before**:
```ts
export function SourceTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('source') || 'all';
  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') { params.delete('source'); } else { params.set('source', id); }
    params.delete('category');
    router.push(`/?${params.toString()}`);
  };
```
- **After**:
```ts
interface SourceTabsProps {
  current: string;
  onChange: (source: string) => void;
}
export function SourceTabs({ current, onChange }: SourceTabsProps) {
  const handleClick = (id: string) => { onChange(id); };
```

### `src/components/category-chips.tsx`
- **변경 이유**: controlled props 전환
- **Before**:
```ts
export function CategoryChips() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get('category') || 'all';
  const handleClick = (id: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id === 'all') { params.delete('category'); } else { params.set('category', id); }
    router.push(`/?${params.toString()}`);
  };
```
- **After**:
```ts
interface CategoryChipsProps {
  current: string;
  onChange: (category: string) => void;
}
export function CategoryChips({ current, onChange }: CategoryChipsProps) {
  const handleClick = (id: string) => { onChange(id); };
```

### `src/app/api/papers/route.ts`
- **변경 이유**: source 파라미터, 컬럼 프로젝션, Cache-Control 헤더
- **Before**:
```ts
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, and, gte, lt, sql, isNotNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const conditions = [];
  conditions.push(isNotNull(papers.summarizedAt));

  if (date) {
    const nextDate = new Date(date + 'T00:00:00Z');
    nextDate.setDate(nextDate.getDate() + 1);
    conditions.push(gte(papers.publishedAt, date + 'T00:00:00Z'));
    conditions.push(lt(papers.publishedAt, nextDate.toISOString()));
  }

  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [results, countResult] = await Promise.all([
    db.select()
      .from(papers)
      .where(where)
      .orderBy(desc(papers.publishedAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(papers)
      .where(where),
  ]);

  return NextResponse.json({
    papers: results,
    total: countResult[0].count,
    page,
    limit,
  });
}
```
- **After**:
```ts
import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, not, and, gte, lt, sql, isNotNull } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get('date');
  const category = searchParams.get('category');
  const source = searchParams.get('source');
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const offset = (page - 1) * limit;

  const conditions = [];
  conditions.push(isNotNull(papers.summarizedAt));

  if (source === 'community') {
    conditions.push(eq(papers.source, 'hacker_news'));
  } else if (source === 'papers') {
    conditions.push(not(eq(papers.source, 'hacker_news')));
  }

  if (date) {
    const nextDate = new Date(date + 'T00:00:00Z');
    nextDate.setDate(nextDate.getDate() + 1);
    conditions.push(gte(papers.publishedAt, date + 'T00:00:00Z'));
    conditions.push(lt(papers.publishedAt, nextDate.toISOString()));
  }

  if (category && category !== 'all') {
    conditions.push(eq(papers.aiCategory, category));
  }

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [results, countResult] = await Promise.all([
    db.select({
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
    })
      .from(papers)
      .where(where)
      .orderBy(desc(papers.publishedAt))
      .limit(limit)
      .offset(offset),
    db.select({ count: sql<number>`count(*)` })
      .from(papers)
      .where(where),
  ]);

  const total = countResult[0].count;

  return NextResponse.json(
    { papers: results, total, page, limit, hasMore: page * limit < total },
    { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
  );
}
```

### `src/app/api/trends/route.ts`
- **변경 이유**: Cache-Control 헤더 추가
- **Before**:
```ts
return NextResponse.json({ period, data: trendData });
```
- **After**:
```ts
return NextResponse.json(
  { period, data: trendData },
  { headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' } }
);
```

## 검증
- `npm run build` — 빌드 성공
- `npm run dev` → localhost:3000
  - Papers/Community 탭 즉시 반응
  - "더 보기" 버튼 동작
  - URL 공유 가능
  - 날짜 그루핑 + devRelevance 정렬 유지
