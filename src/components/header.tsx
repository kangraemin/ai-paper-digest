import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
        <Link href="/" className="font-mono text-lg font-bold tracking-tight">
          <span className="text-muted-foreground">{'>'}</span> paper.digest<span className="animate-pulse">_</span>
        </Link>
        <nav className="flex items-center gap-3">
          <Link href="/trends" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">trends</Link>
          <Link href="/bookmarks" className="text-sm font-mono text-muted-foreground hover:text-foreground transition-colors">saved</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
