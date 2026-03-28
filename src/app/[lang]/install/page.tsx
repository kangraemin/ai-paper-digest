import Link from 'next/link';
import type { Metadata } from 'next';
import { t } from '@/lib/i18n';
import type { Lang } from '@/lib/i18n';

const ERROR_MESSAGES: Record<string, { ko: string; en: string }> = {
  not_in_channel: {
    ko: '봇이 해당 채널에 접근할 수 없습니다. 공개 채널을 선택하거나, 비공개 채널이라면 봇을 먼저 초대해 주세요.',
    en: 'The bot cannot access that channel. Please select a public channel, or invite the bot to your private channel first.',
  },
  channel_not_found: {
    ko: '채널을 찾을 수 없습니다. 다시 시도해 주세요.',
    en: 'Channel not found. Please try again.',
  },
  is_archived: {
    ko: '아카이브된 채널에는 알림을 보낼 수 없습니다. 활성 채널을 선택해 주세요.',
    en: 'Cannot send notifications to an archived channel. Please select an active channel.',
  },
  cant_post_message: {
    ko: '해당 채널에 메시지를 보낼 수 없습니다. 다른 채널을 선택해 주세요.',
    en: 'Cannot post messages to this channel. Please select a different channel.',
  },
  missing_scope: {
    ko: '필요한 권한이 없습니다. 다시 설치해 주세요.',
    en: 'Missing required permissions. Please reinstall.',
  },
  access_denied: {
    ko: '설치가 취소되었습니다.',
    en: 'Installation was cancelled.',
  },
};

export async function generateMetadata({
  params: routeParams,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await routeParams;
  const isKo = lang === 'ko';
  return {
    title: isKo ? 'Slack 알림 설치' : 'Install Slack Notifications',
    description: isKo
      ? 'AI Paper Digest Slack 알림을 설치하세요.'
      : 'Install AI Paper Digest Slack notifications.',
    robots: { index: false },
  };
}

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

  const errorCode = params.error || 'unknown';
  const errorMsg = ERROR_MESSAGES[errorCode]?.[lang as Lang] ?? t('install.fail.error', lang, { code: errorCode });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <h1 className="text-2xl font-bold">{t('install.fail.title', lang)}</h1>
      <p className="text-muted-foreground max-w-sm">{errorMsg}</p>
      <Link href={`/${lang}`} className="text-primary underline">{t('install.fail.link', lang)}</Link>
    </div>
  );
}
