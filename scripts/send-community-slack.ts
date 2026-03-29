import { db } from '../src/lib/db';
import { papers, slackWorkspaces } from '../src/lib/db/schema';
import { sendSlackNotification } from '../src/lib/slack/notify';
import { and, inArray, isNotNull, gte, eq } from 'drizzle-orm';

const REVOKED_ERRORS = ['token_revoked', 'account_inactive', 'not_authed', 'invalid_auth'];

async function main() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rows = await db.select().from(papers)
    .where(and(
      inArray(papers.source, ['hacker_news', 'reddit']),
      isNotNull(papers.summarizedAt),
      gte(papers.summarizedAt, today.toISOString())
    ))
    .limit(10);

  console.log(`오늘 요약된 커뮤 아이템: ${rows.length}개`);
  for (const r of rows) {
    console.log(`  - ${r.id} | ${r.title?.slice(0, 60)}`);
  }

  const siteUrl = process.env.SITE_URL || 'https://paper-digest.app';
  const workspaces = await db.select().from(slackWorkspaces);

  for (const paper of rows) {
    let allOk = true;
    for (const ws of workspaces.filter((w) => w.botToken && w.channelId)) {
      const result = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
      if (!result.ok) {
        allOk = false;
        if (result.error && REVOKED_ERRORS.includes(result.error)) {
          console.log(`  token revoked: ${ws.teamName}, removing from DB`);
          await db.delete(slackWorkspaces).where(eq(slackWorkspaces.id, ws.id));
        }
      }
    }
    console.log(`슬랙 전송 ${allOk ? '✅' : '❌'}: ${paper.title?.slice(0, 50)}`);
  }
}

main().catch(console.error);
