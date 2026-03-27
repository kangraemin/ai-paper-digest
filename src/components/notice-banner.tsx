import Link from 'next/link';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/types';

export function NoticeBanner({ lang }: { lang: Lang }) {
  return (
    <div className="w-full bg-yellow-500/10 border-b border-yellow-500/30 text-center py-2 px-4 text-sm text-yellow-700 dark:text-yellow-400">
      {t('notice.banner.text', lang)}{' '}
      <Link href={`/${lang}/slack-notice`} className="underline font-medium">
        {t('notice.banner.link', lang)}
      </Link>
    </div>
  );
}
