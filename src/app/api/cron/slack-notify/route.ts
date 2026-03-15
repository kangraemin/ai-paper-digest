import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { isNull, isNotNull, and, eq } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';

const categoryColors: Record<string, string> = {
  prompting: '#3b82f6',
  rag: '#10b981',
  agent: '#8b5cf6',
  'fine-tuning': '#f97316',
  finetuning: '#f97316',
  eval: '#ec4899',
  'cost-speed': '#14b8a6',
  cost: '#14b8a6',
  security: '#ef4444',
};

function parseJsonArray(value: string | null): string[] {
  if (!value) return [];
  try {
    const arr = JSON.parse(value);
    if (Array.isArray(arr)) return arr;
  } catch {}
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}

function truncate(s: string | null, n: number): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '...' : s;
}

function buildBlocks(paper: typeof papers.$inferSelect, siteUrl: string) {
  const title = paper.titleKo || paper.title;
  const category = paper.aiCategory || 'AI';
  const isCommunity = paper.source === 'hacker_news';
  const emoji = isCommunity ? '📰' : '📄';
  const sourceLabel = isCommunity ? '커뮤니티' : '논문';
  const pageUrl = `${siteUrl}/papers/${paper.id}`;
  const color = categoryColors[category] ?? '#6b7280';

  const findings = parseJsonArray(paper.keyFindings).slice(0, 2);
  const applies = parseJsonArray(paper.howToApply).slice(0, 2);
  const audience = truncate(paper.targetAudience, 300);

  const bodyParts: string[] = [];
  if (paper.oneLiner) bodyParts.push(`*TL;DR*\n${paper.oneLiner}`);
  if (findings.length > 0) bodyParts.push(`*Core Mechanics*\n${findings.map(f => `• ${f}`).join('\n')}`);
  if (applies.length > 0) bodyParts.push(`*How to apply*\n${applies.map(a => `• ${a}`).join('\n')}`);
  if (audience) bodyParts.push(`*대상 독자*\n${audience}`);

  const headerText = truncate(`${emoji} [${sourceLabel} · ${category}] ${title}`, 149);

  return {
    attachments: [
      {
        color,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: headerText },
          },
          ...(bodyParts.length > 0
            ? [
                {
                  type: 'section',
                  text: {
                    type: 'mrkdwn',
                    text: bodyParts.join('\n\n'),
                  },
                },
              ]
            : []),
          {
            type: 'context',
            elements: [{ type: 'mrkdwn', text: `<${pageUrl}|자세히 보기 →>` }],
          },
        ],
      },
    ],
  };
}

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
    .limit(10);

  const results: { id: string; status: string; error?: string }[] = [];

  for (const paper of pending) {
    const payload = buildBlocks(paper, siteUrl);
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      await db
        .update(papers)
        .set({ slackNotifiedAt: new Date().toISOString() })
        .where(eq(papers.id, paper.id));
      results.push({ id: paper.id, status: 'sent' });
    } else {
      const text = await res.text();
      results.push({ id: paper.id, status: 'failed', error: text });
    }
  }

  return NextResponse.json({
    sent: results.filter(r => r.status === 'sent').length,
    results,
  });
}
