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
    }),
  });

  const data = await response.json();
  if (!data.ok) {
    return NextResponse.redirect(new URL('/install?error=oauth_failed', req.url));
  }

  const { team, incoming_webhook } = data;
  await db
    .insert(slackWorkspaces)
    .values({ teamId: team.id, teamName: team.name, webhookUrl: incoming_webhook.url })
    .onConflictDoUpdate({
      target: slackWorkspaces.teamId,
      set: { webhookUrl: incoming_webhook.url },
    });

  return NextResponse.redirect(new URL('/install?success=true', req.url));
}
