import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { papers, slackWorkspaces } from '@/lib/db/schema';
import { sendSlackNotification } from '@/lib/slack/notify';
import { isNull, isNotNull, and, asc, eq, gte, sql } from 'drizzle-orm';

const DAILY_LIMIT = 15;
const REVOKED_ERRORS = ['token_revoked', 'account_inactive', 'not_authed', 'invalid_auth'];

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret') ?? req.headers.get('authorization')?.replace('Bearer ', '');
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

  const siteUrl = process.env.SITE_URL || 'https://ai-paper-delta.vercel.app';
  let allOk = true;

  for (const ws of workspaces) {
    if (!ws.botToken || !ws.channelId) continue;
    const result = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
    if (!result.ok) {
      allOk = false;
      if (result.error && REVOKED_ERRORS.includes(result.error)) {
        await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
      }
    }
  }

  if (allOk) {
    await db.update(papers)
      .set({ slackNotifiedAt: new Date().toISOString() })
      .where(eq(papers.id, paper.id));
  }

  return NextResponse.json({ sent: paper.title?.slice(0, 60), allOk });
}
