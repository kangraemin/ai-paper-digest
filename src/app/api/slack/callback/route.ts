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
  const channelId = incoming_webhook.channel_id;
  const langPref = req.nextUrl.searchParams.get('state') || 'ko';

  // 1. 공개 채널 자동 join 시도 (비공개 채널은 실패해도 무시)
  await fetch('https://slack.com/api/conversations.join', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
    body: JSON.stringify({ channel: channelId }),
  });

  // 2. 웰컴 메시지 전송으로 채널 유효성 검증 (성공 = 채널 접근 가능 증명)
  const welcomeText = langPref === 'en'
    ? `✅ AI Paper Digest connected! You'll receive daily AI paper updates here.`
    : `✅ AI Paper Digest가 연결되었습니다! 매일 AI 논문/아티클 소식을 이곳으로 전송합니다.`;

  const testRes = await fetch('https://slack.com/api/chat.postMessage', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${access_token}` },
    body: JSON.stringify({ channel: channelId, text: welcomeText }),
  });
  const testData = await testRes.json();

  if (!testData.ok) {
    return NextResponse.redirect(new URL(`/install?error=${encodeURIComponent(testData.error)}`, req.url));
  }

  // 2. 검증 통과 후 DB 저장
  await db
    .insert(slackWorkspaces)
    .values({
      teamId: team.id,
      teamName: team.name,
      botToken: access_token,
      channelId,
      webhookUrl: incoming_webhook.url,
      lang: langPref,
    })
    .onConflictDoUpdate({
      target: slackWorkspaces.teamId,
      set: { botToken: access_token, channelId, webhookUrl: incoming_webhook.url, lang: langPref },
    });

  return NextResponse.redirect(new URL('/install?success=true', req.url));
}
