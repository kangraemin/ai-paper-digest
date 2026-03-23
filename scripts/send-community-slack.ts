import { db } from '../src/lib/db';
import { papers, slackWorkspaces } from '../src/lib/db/schema';
import { sendSlackNotification } from '../src/lib/slack/notify';
import { and, inArray, isNotNull, gte } from 'drizzle-orm';

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

  const siteUrl = process.env.SITE_URL || 'https://ai-paper-delta.vercel.app';
  const workspaces = await db.select().from(slackWorkspaces);
  const fallbackUrl = process.env.SLACK_WEBHOOK_URL;
  const urls = workspaces.length > 0
    ? workspaces.map((w) => w.webhookUrl)
    : fallbackUrl ? [fallbackUrl] : [];

  for (const paper of rows) {
    const results = await Promise.all(urls.map((url) => sendSlackNotification(paper, url, siteUrl)));
    const allOk = results.every(Boolean);
    console.log(`슬랙 전송 ${allOk ? '✅' : '❌'}: ${paper.title?.slice(0, 50)}`);
  }
}

main().catch(console.error);
