import Link from 'next/link';
import { Bookmark } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-6 h-14 w-full">
      <Link href="/" className="font-mono text-sm font-medium tracking-tight">
        <span className="text-zinc-400">{'>'}</span> paper.digest_
      </Link>
      <Link
        href="/bookmarks"
        className="flex items-center justify-center rounded-sm h-8 w-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors"
      >
        <Bookmark size={16} />
      </Link>
    </header>
  );
}
