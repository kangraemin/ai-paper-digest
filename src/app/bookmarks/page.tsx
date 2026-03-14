'use client';

import { useBookmarks } from '@/hooks/use-bookmarks';
import { PaperCard } from '@/components/paper-card';
import { useEffect, useState } from 'react';

interface Paper {
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
}

export default function BookmarksPage() {
  const { bookmarks } = useBookmarks();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookmarks.length === 0) {
      setPapers([]);
      setLoading(false);
      return;
    }

    Promise.all(
      bookmarks.map(id =>
        fetch(`/api/papers/${id}`).then(r => r.ok ? r.json() : null)
      )
    ).then(results => {
      setPapers(results.filter(Boolean));
      setLoading(false);
    });
  }, [bookmarks]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">북마크</h1>
      {loading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : papers.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">
          북마크한 항목이 없습니다.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {papers.map(paper => (
            <PaperCard key={paper.id} {...paper} />
          ))}
        </div>
      )}
    </div>
  );
}
