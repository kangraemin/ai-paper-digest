import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { slackWorkspaces } from '@/lib/db/schema';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/install?error=missing_code', req.url));
  }

  const response = await fetch('https://slack.com/api/oauth.v2.access', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.SLACK_CLIENT_ID!,
      client_secret: process.env.SLACK_CLIENT_SECRET!,
      code,
      redirect_uri: 'https://ai-paper-delta.vercel.app/api/slack/callback',
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    const errCode = data.error || 'oauth_failed';
    return NextResponse.redirect(new URL(`/install?error=${encodeURIComponent(errCode)}`, req.url));
  }

  const { team, access_token, incoming_webhook } = data;
  const langPref = req.nextUrl.searchParams.get('state') || 'ko';
  await db
    .insert(slackWorkspaces)
    .values({
      teamId: team.id,
      teamName: team.name,
      botToken: access_token,
      channelId: incoming_webhook.channel_id,
      lang: langPref,
    })
    .onConflictDoUpdate({
      target: slackWorkspaces.teamId,
      set: { botToken: access_token, channelId: incoming_webhook.channel_id, lang: langPref },
    });

  return NextResponse.redirect(new URL('/install?success=true', req.url));
}
