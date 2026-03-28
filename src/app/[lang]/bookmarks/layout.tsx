import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === 'ko';
  return {
    title: isKo ? '북마크' : 'Bookmarks',
    description: isKo ? '저장한 AI 논문 목록' : 'Your saved AI papers',
    robots: { index: false },
  };
}

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
