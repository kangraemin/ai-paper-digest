'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import type { Lang } from '@/lib/i18n';

export function LangToggle({ lang }: { lang: Lang }) {
  const pathname = usePathname();
  const otherLang = lang === 'ko' ? 'en' : 'ko';
  const newPath = pathname.replace(/^\/(ko|en)/, `/${otherLang}`);

  return (
    <Link
      href={newPath}
      onClick={() => {
        document.cookie = `lang=${otherLang};path=/;max-age=31536000`;
      }}
      className="flex items-center justify-center rounded-sm h-8 px-2 bg-card hover:bg-accent text-muted-foreground hover:text-foreground border border-border transition-colors font-mono text-[12px]"
    >
      {lang === 'ko' ? 'EN' : 'KO'}
    </Link>
  );
}
