import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

export function Footer({ lang }: { lang: Lang }) {
  const t = lang === 'en'
    ? { trends: 'Trends', bookmarks: 'Bookmarks', rss: 'RSS', home: 'Home' }
    : { trends: '트렌드', bookmarks: '북마크', rss: 'RSS', home: '홈' };
  const year = new Date().getFullYear();
  return (
    <footer className="w-full border-t border-border mt-16 py-8 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto flex flex-wrap items-center justify-between gap-4 font-mono text-[13px] text-muted-foreground">
        <span>© {year} AI Paper Digest</span>
        <nav className="flex flex-wrap gap-x-5 gap-y-2">
          <Link href={`/${lang}`} className="hover:text-foreground transition-colors">{t.home}</Link>
          <Link href={`/${lang}/trends`} className="hover:text-foreground transition-colors">{t.trends}</Link>
          <Link href={`/${lang}/bookmarks`} className="hover:text-foreground transition-colors">{t.bookmarks}</Link>
          <Link href={`/api/rss?lang=${lang}`} className="hover:text-foreground transition-colors">{t.rss}</Link>
        </nav>
      </div>
    </footer>
  );
}
