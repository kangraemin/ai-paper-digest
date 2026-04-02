import type { Metadata } from 'next'
import { notFound } from 'next/navigation';
import { Header } from '@/components/header';
import { NoticeBanner } from '@/components/notice-banner';
import { SUPPORTED_LANGS } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'

export function generateStaticParams() {
  return SUPPORTED_LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>
}): Promise<Metadata> {
  const { lang } = await params
  return {
    alternates: {
      canonical: `${BASE}/${lang}`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LANGS.map((l) => [
            l === 'ko' ? 'ko-KR' : 'en-US',
            `${BASE}/${l}`,
          ])
        ),
        'x-default': `${BASE}/en`,
      },
    },
  }
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
