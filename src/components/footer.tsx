import Link from 'next/link';
import type { Lang } from '@/lib/i18n';
import { TOPIC_NAME_KO, TOPIC_NAME_EN, type TopicSlug } from '@/lib/topics';

const POPULAR_TOPICS: TopicSlug[] = ['claude', 'agent', 'code', 'reasoning', 'mcp'];

export function Footer({ lang }: { lang: Lang }) {
  const t = lang === 'en'
    ? { trends: 'Trends', bookmarks: 'Bookmarks', rss: 'RSS', home: 'Home', topics: 'Topics' }
    : { trends: '트렌드', bookmarks: '북마크', rss: 'RSS', home: '홈', topics: '토픽' };
  const year = new Date().getFullYear();
  const TOPIC_NAME = lang === 'en' ? TOPIC_NAME_EN : TOPIC_NAME_KO;
  return (
    <footer className="w-full border-t border-border mt-16 py-8 px-4 sm:px-6">
      <div className="max-w-[800px] mx-auto flex flex-col gap-3 font-mono text-[13px] text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span>© {year} AI Paper Digest</span>
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href={`/${lang}`} className="hover:text-foreground transition-colors">{t.home}</Link>
            <Link href={`/${lang}/trends`} className="hover:text-foreground transition-colors">{t.trends}</Link>
            <Link href={`/${lang}/bookmarks`} className="hover:text-foreground transition-colors">{t.bookmarks}</Link>
            <Link href={`/api/rss?lang=${lang}`} className="hover:text-foreground transition-colors">{t.rss}</Link>
          </nav>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-[12px]">
          <span className="text-muted-foreground/70">{t.topics}:</span>
          {POPULAR_TOPICS.map((slug) => (
            <Link
              key={slug}
              href={`/${lang}/topics/${slug}`}
              className="px-2 py-0.5 rounded-sm border border-border hover:border-foreground/40 hover:text-foreground transition-colors"
            >
              {TOPIC_NAME[slug]}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
