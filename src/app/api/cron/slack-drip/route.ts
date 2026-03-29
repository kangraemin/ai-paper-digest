import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { papers, slackWorkspaces } from '@/lib/db/schema';
import { sendSlackNotification } from '@/lib/slack/notify';
import { isNull, isNotNull, and, asc, eq, gte, sql } from 'drizzle-orm';

const DAILY_LIMIT = 15;
const FAIL_LIMIT = 10;
const REVOKED_ERRORS = ['token_revoked', 'account_inactive', 'not_authed', 'invalid_auth'];

const kstDateStr = () => new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);
const kstTodayStartUTC = () => new Date(kstDateStr() + 'T00:00:00+09:00').toISOString();

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

  // KST 오늘 발송 건수 체크
  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(papers)
    .where(gte(papers.slackNotifiedAt, kstTodayStartUTC()));

  if (Number(count) >= DAILY_LIMIT) {
    return NextResponse.json({ skipped: true, reason: `Daily limit reached (${count}/${DAILY_LIMIT})` });
  }

  const [paper] = await db.select()
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), isNull(papers.slackNotifiedAt)))
    .orderBy(asc(papers.summarizedAt))
    .limit(1);

  if (!paper) {
    return NextResponse.json({ skipped: true, reason: 'No papers to notify' });
  }

  const workspaces = await db.select().from(slackWorkspaces);
  if (workspaces.length === 0) {
    return NextResponse.json({ skipped: true, reason: 'No workspaces' });
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim();
  const results: { team: string; ok: boolean; error?: string }[] = [];

  for (const ws of workspaces) {
    if (!ws.botToken || !ws.channelId) continue;

    const result = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
    console.log(`[slack-drip] ${ws.teamName}: ${result.ok ? 'OK' : `FAIL (${result.error})`}`);

    if (result.ok) {
      if ((ws.failCount ?? 0) > 0) {
        await db.update(slackWorkspaces)
          .set({ failCount: 0, lastFailedAt: null })
          .where(eq(slackWorkspaces.id, ws.id));
      }
    } else {
      if (REVOKED_ERRORS.includes(result.error ?? '')) {
        await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
      } else {
        const today = kstDateStr();
        const newCount = ws.lastFailedAt !== today ? (ws.failCount ?? 0) + 1 : (ws.failCount ?? 0);
        if (newCount >= FAIL_LIMIT) {
          await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
        } else {
          await db.update(slackWorkspaces)
            .set({ failCount: newCount, lastFailedAt: today })
            .where(eq(slackWorkspaces.id, ws.id));
        }
      }
    }

    results.push({ team: ws.teamName, ok: result.ok, error: result.error });
  }

  await db.update(papers)
    .set({ slackNotifiedAt: new Date().toISOString() })
    .where(eq(papers.id, paper.id));

  return NextResponse.json({ sent: paper.title?.slice(0, 60), results });
}
