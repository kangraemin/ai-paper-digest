import { db } from '../src/lib/db';
import { papers, slackWorkspaces } from '../src/lib/db/schema';
import { sendSlackNotification } from '../src/lib/slack/notify';
import { isNull, isNotNull, and, asc, eq } from 'drizzle-orm';

async function main() {
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

  const siteUrl = process.env.SITE_URL || 'https://ai-paper-delta.vercel.app';
  let allOk = true;

  for (const ws of workspaces) {
    if (!ws.botToken || !ws.channelId) continue;
    const ok = await sendSlackNotification(paper, ws.botToken, ws.channelId, siteUrl, ws.lang ?? 'ko');
    if (!ok) allOk = false;
    console.log(`  ${ws.teamName}: ${ok ? 'OK' : 'FAIL'} (${ws.lang ?? 'ko'})`);
  }

  if (allOk) {
    await db.update(papers)
      .set({ slackNotifiedAt: new Date().toISOString() })
      .where(eq(papers.id, paper.id));
    console.log(`Updated slackNotifiedAt for ${paper.id}`);
  }
}

main().catch(console.error);
