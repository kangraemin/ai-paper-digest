import Link from 'next/link';
import type { Metadata } from 'next';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n/types';

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'}/api/slack/callback`;
const SLACK_SCOPE = 'chat:write,chat:write.customize,channels:read,channels:join,groups:read,reactions:write,reactions:read,files:write,files:read,users:read,commands,incoming-webhook,links:read,links:write';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const isKo = lang === 'ko';
  return {
    title: isKo ? 'Slack 알림 설정' : 'Slack Notifications',
    description: isKo
      ? 'Slack으로 AI 논문 요약을 매일 받아보세요.'
      : 'Receive daily AI paper summaries via Slack.',
    robots: { index: false, follow: false },
  };
}

export default async function SlackNoticePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  const installUrl = clientId
    ? `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${SLACK_SCOPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${lang}`
    : '#';

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
