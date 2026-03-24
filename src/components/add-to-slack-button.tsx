'use client';

import type { Lang } from '@/lib/i18n';

const REDIRECT_URI = 'https://ai-paper-delta.vercel.app/api/slack/callback';
const SLACK_SCOPE = 'chat:write,chat:write.customize,channels:read,channels:join,groups:read,reactions:write,reactions:read,files:write,files:read,users:read,im:write,im:read,commands';

export function AddToSlackButton({ lang }: { lang: Lang }) {
  const clientId = process.env.NEXT_PUBLIC_SLACK_CLIENT_ID;
  if (!clientId) return null;

  const installUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${SLACK_SCOPE}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&state=${lang}`;

  return (
    <a href={installUrl} title="Add to Slack" className="flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Add to Slack"
        height="32"
        width="111"
        src="https://platform.slack-edge.com/img/add_to_slack.png"
        srcSet="https://platform.slack-edge.com/img/add_to_slack.png 1x, https://platform.slack-edge.com/img/add_to_slack@2x.png 2x"
        className="dark:invert"
      />
    </a>
  );
}
