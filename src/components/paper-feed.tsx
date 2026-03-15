'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { SourceTabs } from './source-tabs';
import { CategoryChips } from './category-chips';
import { PaperCard } from './paper-card';
import type { PaperListItem } from '@/lib/types';

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

function groupByDate(items: PaperListItem[]): Record<string, PaperListItem[]> {
  const groups: Record<string, PaperListItem[]> = {};
  for (const item of items) {
    const date = item.publishedAt.split('T')[0];
    if (!groups[date]) groups[date] = [];
    groups[date].push(item);
  }
  return groups;
}

interface PaperFeedProps {
  initialPapers: PaperListItem[];
}

export function PaperFeed({ initialPapers }: PaperFeedProps) {
  const [allPapers, setAllPapers] = useState(initialPapers);
  const [source, setSource] = useState('all');
  const [category, setCategory] = useState('all');
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

  // 날짜 그루핑 + devRelevance 정렬
  const grouped = groupByDate(allPapers);
  for (const date of Object.keys(grouped)) {
    grouped[date].sort((a, b) => (b.devRelevance ?? 0) - (a.devRelevance ?? 0));
  }

  return (
    <>
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <SourceTabs current={source} onChange={(s) => { setSource(s); setCategory('all'); }} />
        <div className="mt-4">
          <CategoryChips current={category} onChange={setCategory} />
        </div>
      </div>

      {loading ? (
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-48 h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-zinc-400 rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm text-zinc-500">로딩 중...</p>
        </div>
      ) : allPapers.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4">¯\_(ツ)_/¯</p>
          <p className="text-zinc-400">오늘은 조용한 날이네요.</p>
          <p className="text-sm text-zinc-500 mt-1">
            {source === 'community' ? 'HN 수집을 실행하거나 내일 다시 확인해 주세요.' : '논문 수집을 실행하거나 내일 다시 확인해 주세요.'}
          </p>
        </div>
      ) : (
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

          {hasMore && (
            <div className="text-center py-4">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2 rounded-lg border border-zinc-700 text-zinc-300 hover:bg-zinc-800 transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-16 h-1 bg-zinc-700 rounded-full overflow-hidden inline-block">
                      <span className="block h-full bg-zinc-400 rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
                    </span>
                    로딩 중...
                  </span>
                ) : '더 보기'}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
