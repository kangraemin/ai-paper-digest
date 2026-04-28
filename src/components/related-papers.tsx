import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

type RelatedItem = {
  id: string;
  title: string;
  titleKo: string | null;
  oneLiner: string | null;
  oneLinerEn: string | null;
  publishedAt: string;
  aiCategory: string | null;
};

export function RelatedPapers({ items, lang }: { items: RelatedItem[]; lang: Lang }) {
  if (items.length === 0) return null;
  const heading = lang === 'en' ? 'Related Papers' : '관련 논문';
  return (
    <section className="mb-10">
      <h3 className="text-[14px] font-semibold text-foreground uppercase tracking-wide border-b border-border pb-2 mb-4">
        {heading}
      </h3>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {items.map((p) => {
          const title = lang === 'en' ? (p.title || p.titleKo || '') : (p.titleKo || p.title || '');
          const summary = lang === 'en' ? (p.oneLinerEn || p.oneLiner || '') : (p.oneLiner || p.oneLinerEn || '');
          return (
            <li key={p.id} className="border border-border rounded-sm p-3 hover:border-foreground/40 transition-colors">
              <Link href={`/${lang}/papers/${p.id}`} className="block">
                <p className="text-[13px] font-semibold text-foreground line-clamp-2 mb-1">{title}</p>
                {summary && (
                  <p className="text-[12px] text-muted-foreground line-clamp-2">{summary}</p>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
