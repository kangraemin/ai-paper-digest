'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SourceTabs } from './source-tabs';
import { CategoryChips } from './category-chips';
import { PaperCard } from './paper-card';

import type { PaperListItem } from '@/lib/types';
import type { Lang } from '@/lib/i18n';
import { t } from '@/lib/i18n';

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function formatDateHeader(dateStr: string, lang: Lang): string {
  const date = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) return t('date.today', lang);
  if (date.toDateString() === yesterday.toDateString()) return t('date.yesterday', lang);

  const weekdays = t('date.weekdays', lang).split(',');
  if (lang === 'en') {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${weekdays[date.getDay()]}, ${months[date.getMonth()]} ${date.getDate()}`;
  }
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
  initialSource?: string;
  initialCategory?: string;
  lang?: Lang;
}

export function PaperFeed({ initialPapers, initialSource = 'all', initialCategory = 'all', lang = 'ko' }: PaperFeedProps) {
  const [allPapers, setAllPapers] = useState(initialPapers);
  const [source, setSource] = useState(initialSource);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPapers.length >= 20);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const searchQuery = searchParams.get('q') ?? '';
  const [searchResults, setSearchResults] = useState<PaperListItem[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchPage, setSearchPage] = useState(1);
  const [searchHasMore, setSearchHasMore] = useState(false);
  const [searchLoadingMore, setSearchLoadingMore] = useState(false);
  const isInitialRender = useRef(true);

  // 검색 debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setSearchPage(1);
      setSearchHasMore(false);
      return;
    }
    const timer = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20&page=1`);
        const data = await res.json();
        setSearchResults(data.papers);
        setSearchPage(1);
        setSearchHasMore(data.papers.length === 20 && data.total > 20);
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'search', {
            search_term: searchQuery,
            results_count: data.papers.length,
          });
        }
      } finally {
        setSearching(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const loadMoreSearch = useCallback(async () => {
    setSearchLoadingMore(true);
    const nextPage = searchPage + 1;
    const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20&page=${nextPage}`);
    const data = await res.json();
    setSearchResults(prev => [...prev, ...data.papers]);
    setSearchPage(nextPage);
    setSearchHasMore(data.papers.length === 20 && (searchResults.length + data.papers.length) < data.total);
    setSearchLoadingMore(false);
  }, [searchPage, searchQuery, searchResults.length]);

  // 필터 변경 시 fetch
  useEffect(() => {
    if (isInitialRender.current) {
      isInitialRender.current = false;
      // 서버가 이미 올바른 필터로 렌더링했으므로 초기 fetch 스킵
      return;
    }
    const params = new URLSearchParams();
    if (source !== 'all') params.set('source', source);
    if (category !== 'all') params.set('category', category);
    router.replace(params.toString() ? `/?${params}` : '/', { scroll: false });

    setLoading(true);
    setPage(1);
    fetch(`/api/papers?${params}&limit=20`)
      .then(r => r.json())
      .then(data => {
        setAllPapers(data.papers);
        setHasMore(data.hasMore);
        setLoading(false);
      });
  }, [source, category, router]);

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

  const isSearchMode = searchQuery.trim().length > 0;

  return (
    <>
      <div className="mb-8 border-b border-border pb-4">

        <SourceTabs current={source} onChange={(s) => { setSource(s); setCategory('all'); }} />
        <div className="mt-4">
          <CategoryChips current={category} onChange={setCategory} />
        </div>
      </div>

      {isSearchMode ? (
        // 검색 모드
        searching ? (
          <div className="py-12 flex flex-col items-center gap-3">
            <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-muted-foreground rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
            </div>
            <p className="text-sm text-muted-foreground">{t('feed.searching', lang)}</p>
          </div>
        ) : searchResults.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-muted-foreground">{t('feed.noResults', lang, { q: searchQuery })}</p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground mb-4">{t('feed.searchResults', lang, { n: String(searchResults.length) })}</p>
            {Object.entries(groupByDate(searchResults)).map(([date, datePapers]) => (
              <section key={date}>
                <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4">
                  <h2 className="font-mono text-[12px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
                    {formatDateHeader(date, lang)} · {t('feed.count', lang, { n: String(datePapers.length) })}
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
                      oneLinerEn={paper.oneLinerEn ?? null}
                      aiCategory={paper.aiCategory}
                      devRelevance={paper.devRelevance}
                      targetAudience={paper.targetAudience}
                      tags={paper.tags}
                      source={paper.source}
                      isHot={paper.isHot}
                      publishedAt={paper.publishedAt}
                      authors={paper.authors}
                      venue={paper.venue}
                      affiliations={paper.affiliations}
                      lang={lang}
                    />
                  ))}
                </div>
              </section>
            ))}
            {searchHasMore && (
              <div className="text-center py-4">
                <button
                  onClick={loadMoreSearch}
                  disabled={searchLoadingMore}
                  className="px-6 py-2 rounded-lg border border-border text-foreground/80 hover:bg-accent transition-colors disabled:opacity-50"
                >
                  {searchLoadingMore ? (
                    <span className="flex items-center gap-2">
                      <span className="w-16 h-1 bg-muted rounded-full overflow-hidden inline-block">
                        <span className="block h-full bg-muted-foreground rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
                      </span>
                      {t('feed.loading', lang)}
                    </span>
                  ) : t('feed.loadMore', lang)}
                </button>
              </div>
            )}
          </div>
        )
      ) : (
        // 기존 일반 모드
        loading ? (
        <div className="py-12 flex flex-col items-center gap-3">
          <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-muted-foreground rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
          </div>
          <p className="text-sm text-muted-foreground">{t('feed.loading', lang)}</p>
        </div>
      ) : allPapers.length === 0 ? (
        <div className="py-20 text-center">
          <p className="text-4xl mb-4">¯\_(ツ)_/¯</p>
          <p className="text-muted-foreground">{t('feed.emptyDay', lang)}</p>
          <p className="text-sm text-muted-foreground mt-1">
            {source === 'community' ? t('feed.emptyCommunity', lang) : t('feed.emptyPapers', lang)}
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, datePapers]) => (
            <section key={date}>
              <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-2 mb-4">
                <h2 className="font-mono text-[12px] text-muted-foreground uppercase tracking-wider mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground inline-block" />
                  {formatDateHeader(date, lang)} · {t('feed.count', lang, { n: String(datePapers.length) })}
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
                    oneLinerEn={paper.oneLinerEn ?? null}
                    aiCategory={paper.aiCategory}
                    devRelevance={paper.devRelevance}
                    targetAudience={paper.targetAudience}
                    tags={paper.tags}
                    source={paper.source}
                    isHot={paper.isHot}
                    publishedAt={paper.publishedAt}
                    authors={paper.authors}
                    venue={paper.venue}
                    affiliations={paper.affiliations}
                    lang={lang}
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
                className="px-6 py-2 rounded-lg border border-border text-foreground/80 hover:bg-accent transition-colors disabled:opacity-50"
              >
                {loadingMore ? (
                  <span className="flex items-center gap-2">
                    <span className="w-16 h-1 bg-muted rounded-full overflow-hidden inline-block">
                      <span className="block h-full bg-muted-foreground rounded-full animate-[loading-bar_1.2s_ease-in-out_infinite]" />
                    </span>
                    로딩 중...
                  </span>
                ) : t('feed.loadMore', lang)}
              </button>
            </div>
          )}
        </div>
      )
      )}
    </>
  );
}
