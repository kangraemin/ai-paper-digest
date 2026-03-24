import Link from 'next/link';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

export default async function InstallPage({
  params: routeParams,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const { lang: langParam } = await routeParams;
  const lang = langParam as Lang;
  const params = await searchParams;

  if (params.success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
        <h1 className="text-2xl font-bold">{t('install.success.title', lang)}</h1>
        <p className="text-muted-foreground">{t('install.success.desc', lang)}</p>
        <Link href={`/${lang}`} className="text-primary underline">{t('install.success.link', lang)}</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-2xl font-bold">{t('install.fail.title', lang)}</h1>
      <p className="text-muted-foreground">{t('install.fail.error', lang, { code: params.error || 'unknown' })}</p>
      <Link href={`/${lang}`} className="text-primary underline">{t('install.fail.link', lang)}</Link>
    </div>
  );
}
