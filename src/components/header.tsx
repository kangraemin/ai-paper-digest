import Link from 'next/link';
import { Bookmark } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between border-b border-border bg-background/95 backdrop-blur px-4 sm:px-6 h-14 w-full">
      <Link href="/" className="font-mono text-sm font-medium tracking-tight">
        <span className="text-muted-foreground">{'>'}</span> paper.digest_
      </Link>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Link
          href="/bookmarks"
          className="flex items-center justify-center rounded-sm h-8 w-8 bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors"
        >
          <Bookmark size={16} />
        </Link>
      </div>
    </header>
  );
}
