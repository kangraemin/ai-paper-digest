import Link from 'next/link';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/types';

export default async function SlackNoticePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const installUrl = '/api/slack/install';

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 flex flex-col gap-6">
      <h1 className="text-2xl font-bold">{t('notice.title', lang as Lang)}</h1>
      <p className="text-muted-foreground whitespace-pre-line leading-relaxed">
        {t('notice.body', lang as Lang)}
      </p>
      <div className="flex gap-3 flex-wrap">
        <a
          href={installUrl}
          className="inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90"
        >
          {t('notice.reinstall', lang as Lang)}
        </a>
        <Link
          href={`/${lang}`}
          className="inline-flex items-center px-4 py-2 border border-border rounded-md text-sm hover:bg-accent"
        >
          {t('notice.back', lang as Lang)}
        </Link>
      </div>
    </div>
  );
}
