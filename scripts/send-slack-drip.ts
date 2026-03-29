import { db } from '../src/lib/db';
import { papers, slackWorkspaces } from '../src/lib/db/schema';
import { sendSlackNotification } from '../src/lib/slack/notify';
import { isNull, isNotNull, and, asc, eq, gte, sql } from 'drizzle-orm';

const DAILY_LIMIT = 15;

async function main() {
  // 오늘 이미 발송한 수 확인
  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);
  const [{ count }] = await db.select({ count: sql<number>`count(*)` })
    .from(papers)
    .where(gte(papers.slackNotifiedAt, todayStart.toISOString()));

  if (Number(count) >= DAILY_LIMIT) {
    console.log(`Daily limit reached (${count}/${DAILY_LIMIT})`);
    return;
  }

  // 미발송 논문 1개 (가장 오래된 것 우선)
  const [paper] = await db.select()
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), isNull(papers.slackNotifiedAt)))
    .orderBy(asc(papers.publishedAt))
    .limit(1);

  if (!paper) {
    console.log('No papers to notify');
    return;
  }

  console.log(`Sending: ${paper.title?.slice(0, 60)}`);

  const workspaces = await db.select().from(slackWorkspaces);
  if (workspaces.length === 0) {
    console.log('No workspaces registered');
    return;
  }

  const siteUrl = process.env.SITE_URL || 'https://paper-digest.app';
  const REVOKED_ERRORS = ['token_revoked', 'account_inactive', 'not_authed', 'invalid_auth'];
  let allOk = true;

  for (const ws of workspaces) {
    if (!ws.botToken || !ws.channelId) continue;
    const result = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
    if (!result.ok) {
      allOk = false;
      if (result.error && REVOKED_ERRORS.includes(result.error)) {
        console.log(`  ${ws.teamName}: token revoked, removing from DB`);
        await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
        continue;
      }
    }
    console.log(`  ${ws.teamName}: ${result.ok ? 'OK' : `FAIL (${result.error})`} (${ws.lang ?? 'ko'})`);
  }

  if (allOk) {
    await db.update(papers)
      .set({ slackNotifiedAt: new Date().toISOString() })
      .where(eq(papers.id, paper.id));
    console.log(`Updated slackNotifiedAt for ${paper.id}`);
  }
}

main().catch(console.error);
