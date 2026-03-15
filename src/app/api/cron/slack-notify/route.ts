import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { isNull, isNotNull, and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { sendSlackNotification } from '@/lib/slack/notify';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  if (!webhookUrl) {
    return NextResponse.json({ error: 'SLACK_WEBHOOK_URL not set' }, { status: 500 });
  }

  const siteUrl = process.env.SITE_URL || 'https://ai-paper-delta.vercel.app';

  const pending = await db
    .select()
    .from(papers)
    .where(and(isNotNull(papers.summarizedAt), isNull(papers.slackNotifiedAt)))
    .orderBy(papers.summarizedAt)
    .limit(1);

  const results: { id: string; status: string; error?: string }[] = [];

  for (const paper of pending) {
    const ok = await sendSlackNotification(paper, webhookUrl, siteUrl);
    if (ok) {
      await db
        .update(papers)
        .set({ slackNotifiedAt: new Date().toISOString() })
        .where(eq(papers.id, paper.id));
      results.push({ id: paper.id, status: 'sent' });
    } else {
      results.push({ id: paper.id, status: 'failed' });
    }
  }

  return NextResponse.json({
    sent: results.filter(r => r.status === 'sent').length,
    results,
  });
}
