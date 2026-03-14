'use client';

import Link from 'next/link';
import { Search, Bookmark } from 'lucide-react';
import { useState } from 'react';
import { SubmitPaperModal } from './submit-paper-modal';

export function Header() {
  const [showSubmit, setShowSubmit] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-6 h-14 w-full">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight">
          <span className="text-zinc-400">{'>'}</span> paper.digest_
        </Link>
        <div className="flex gap-2">
          <Link
            href="/search"
            className="flex items-center justify-center rounded-sm h-8 w-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <Search size={16} />
          </Link>
          <Link
            href="/bookmarks"
            className="flex items-center justify-center rounded-sm h-8 w-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
          >
            <Bookmark size={16} />
          </Link>
          <button
            onClick={() => setShowSubmit(true)}
            className="hidden sm:flex items-center justify-center rounded-sm h-8 px-3 bg-zinc-50 text-zinc-950 text-[13px] font-medium hover:bg-zinc-300 transition-colors"
          >
            Submit Paper
          </button>
        </div>
      </header>
      <SubmitPaperModal open={showSubmit} onClose={() => setShowSubmit(false)} />
    </>
  );
}
