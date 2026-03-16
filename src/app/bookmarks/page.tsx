'use client';

import { useBookmarks } from '@/hooks/use-bookmarks';
import { useEffect, useState } from 'react';
import { Bookmark, BookmarkMinus, Search } from 'lucide-react';
import Link from 'next/link';

const categoryColorMap: Record<string, string> = {
  prompting: '#3b82f6',
  rag: '#10b981',
  agent: '#8b5cf6',
  'fine-tuning': '#f97316',
  finetuning: '#f97316',
  eval: '#ec4899',
  'cost-speed': '#14b8a6',
  cost: '#14b8a6',
  security: '#ef4444',
};

const categoryDisplayName: Record<string, string> = {
  prompting: 'Prompting',
  rag: 'RAG',
  agent: 'Agent',
  'fine-tuning': 'Fine-tuning',
  finetuning: 'Fine-tuning',
  eval: 'Eval',
  'cost-speed': 'Cost/Speed',
  cost: 'Cost',
  security: 'Security',
};

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

const PAGE_SIZE = 10;

export default function BookmarksPage() {
  const { bookmarks, toggle } = useBookmarks();
  const [papers, setPapers] = useState<Paper[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(0);

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

  const filtered = papers.filter(p => {
    if (!filter) return true;
    const q = filter.toLowerCase();
    return (p.titleKo?.toLowerCase().includes(q) || p.title.toLowerCase().includes(q) || p.aiCategory?.toLowerCase().includes(q));
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  return (
    <div className="w-full max-w-[1024px] flex flex-col px-4 sm:px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Bookmark size={18} className="text-muted-foreground" />
            <h1 className="text-foreground text-2xl font-semibold tracking-[-0.02em]">Bookmarks</h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            {papers.length} saved papers
          </p>
        </div>
        {/* Filter */}
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={filter}
            onChange={e => { setFilter(e.target.value); setPage(0); }}
            placeholder="Filter bookmarks..."
            className="w-full h-8 bg-card border border-border rounded-sm pl-9 pr-3 text-[13px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
          />
        </div>
      </div>

      {loading ? (
        <p className="text-muted-foreground py-12 text-center">로딩 중...</p>
      ) : papers.length === 0 ? (
        <p className="py-12 text-center text-muted-foreground">북마크한 항목이 없습니다.</p>
      ) : (
        <>
          {/* Table */}
          <div className="w-full border border-border rounded-sm bg-card/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse" style={{ tableLayout: 'fixed' }}>
                <thead>
                  <tr className="border-b border-border bg-card/80">
                    <th className="w-[50%] px-4 py-3 text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                    <th className="w-[20%] px-4 py-3 text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                    <th className="hidden sm:table-cell w-[15%] px-4 py-3 text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-wider">Added</th>
                    <th className="hidden md:table-cell w-[10%] px-4 py-3 text-[12px] font-mono font-medium text-muted-foreground uppercase tracking-wider text-right">Rel</th>
                    <th className="w-[5%] px-4 py-3"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {paginated.map(paper => {
                    const catColor = paper.aiCategory ? (categoryColorMap[paper.aiCategory] ?? '#888') : '#888';
                    const catName = paper.aiCategory ? (categoryDisplayName[paper.aiCategory] ?? paper.aiCategory) : '-';
                    return (
                      <tr key={paper.id} className="group h-10 hover:bg-accent/50 transition-colors">
                        <td className="px-4 py-2 truncate">
                          <Link href={`/papers/${paper.id}`} className="text-[14px] text-foreground font-medium hover:underline">
                            {paper.titleKo || paper.title}
                          </Link>
                        </td>
                        <td className="px-4 py-2 truncate">
                          <div className="inline-flex items-center gap-1.5">
                            <div className="size-1.5 rounded-full" style={{ backgroundColor: catColor }} />
                            <span className="text-[12px] font-mono text-muted-foreground group-hover:text-foreground/80">{catName}</span>
                          </div>
                        </td>
                        <td className="hidden sm:table-cell px-4 py-2 text-[12px] font-mono text-muted-foreground">
                          {paper.publishedAt.split('T')[0]}
                        </td>
                        <td className="hidden md:table-cell px-4 py-2 text-[12px] font-mono text-muted-foreground text-right">
                          {paper.devRelevance != null ? `${paper.devRelevance}%` : '-'}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <button
                            onClick={(e) => { e.preventDefault(); toggle(paper.id); }}
                            className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all p-1"
                            title="Remove bookmark"
                          >
                            <BookmarkMinus size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 px-2">
              <span className="text-[12px] font-mono text-muted-foreground">
                Showing {page * PAGE_SIZE + 1}-{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="text-[12px] font-mono text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
