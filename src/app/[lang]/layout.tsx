import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { NoticeBanner } from '@/components/notice-banner';
import { SUPPORTED_LANGS } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!SUPPORTED_LANGS.includes(lang as Lang)) notFound();

  return (
    <>
      <NoticeBanner lang={lang as Lang} />
      <Header lang={lang as Lang} />
      <main className="flex-1 flex flex-col items-center w-full">{children}</main>
    </>
  );
}
