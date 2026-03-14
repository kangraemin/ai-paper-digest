import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

export function Header() {
  return (
    <header className="border-b bg-background">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="text-xl font-bold">
          AI Paper Digest
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/" className="text-sm hover:underline">Home</Link>
          <Link href="/trends" className="text-sm hover:underline">Trends</Link>
          <Link href="/bookmarks" className="text-sm hover:underline">Bookmarks</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
