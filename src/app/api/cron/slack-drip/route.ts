import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { papers, slackWorkspaces, slackNotifications } from '@/lib/db/schema';
import { sendSlackNotification } from '@/lib/slack/notify';
import { isNull, isNotNull, and, asc, eq, gte, sql } from 'drizzle-orm';

const DAILY_LIMIT = 20;
const REVOKED_ERRORS = ['token_revoked', 'account_inactive', 'not_authed', 'invalid_auth'];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') ?? req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // KST 9시~20시 외 skip
  const kstHour = new Date(Date.now() + 9 * 60 * 60 * 1000).getUTCHours();
  if (kstHour < 9 || kstHour >= 20) {
    return NextResponse.json({ skipped: true, reason: `Outside KST hours (${kstHour}h)` });
  }

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(papers)
    .where(gte(papers.slackNotifiedAt, todayStart.toISOString()));

  if (Number(count) >= DAILY_LIMIT) {
    return NextResponse.json({ skipped: true, reason: `Daily limit reached (${count}/${DAILY_LIMIT})` });
  }

  const [paper] = await db.select()
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), isNull(papers.slackNotifiedAt)))
    .orderBy(asc(papers.publishedAt))
    .limit(1);

  if (!paper) {
    return NextResponse.json({ skipped: true, reason: 'No papers to notify' });
  }

  const workspaces = await db.select().from(slackWorkspaces);
  if (workspaces.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No workspaces' });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app';
  const results: { team: string; ok: boolean; error?: string }[] = [];

  for (const ws of workspaces) {
    if (!ws.botToken || !ws.channelId) continue;

    // 이미 성공 발송된 채널 스킵
    const [existing] = await db.select().from(slackNotifications)
      .where(and(
        eq(slackNotifications.paperId, paper.id),
        eq(slackNotifications.workspaceId, String(ws.id)),
        eq(slackNotifications.ok, true)
      )).limit(1);
    if (existing) continue;

    const result = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
    console.log(`[slack-drip] ${ws.teamName}: ${result.ok ? 'OK' : `FAIL (${result.error})`}`);

    // 성공/실패 무조건 기록
    await db.insert(slackNotifications)
      .values({
        id: `${paper.id}_${ws.id}`,
        paperId: paper.id,
        workspaceId: String(ws.id),
        sentAt: new Date().toISOString(),
        ok: result.ok,
        error: result.error ?? null,
      })
      .onConflictDoUpdate({
        target: slackNotifications.id,
        set: { sentAt: new Date().toISOString(), ok: result.ok, error: result.error ?? null },
      });

    if (!result.ok && result.error && REVOKED_ERRORS.includes(result.error)) {
      await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
    }
    results.push({ team: ws.teamName, ok: result.ok, error: result.error });
  }

  // 무조건 slackNotifiedAt 기록 (중복 발송 방지)
  await db.update(papers)
    .set({ slackNotifiedAt: new Date().toISOString() })
    .where(eq(papers.id, paper.id));

  return NextResponse.json({ sent: paper.title?.slice(0, 60), results });
}
