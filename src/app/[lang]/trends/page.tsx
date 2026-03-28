import type { Metadata } from 'next';
import TrendsClient from '@/components/trends-client';

const BASE = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === 'ko';
  return {
    title: isKo ? '트렌드 분석' : 'Trend Analysis',
    description: isKo
      ? '카테고리별 AI/LLM 논문 트렌드를 주간/월간으로 확인하세요.'
      : 'Explore weekly and monthly trends in AI/LLM papers by category.',
    alternates: {
      canonical: `${BASE}/${lang}/trends`,
      languages: {
        'ko-KR': `${BASE}/ko/trends`,
        'en-US': `${BASE}/en/trends`,
      },
    },
  };
}

export default function TrendsPage() {
  return <TrendsClient />;
}
