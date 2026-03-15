import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, and, isNotNull } from 'drizzle-orm';

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function buildDescription(p: typeof papers.$inferSelect): string {
  const text = p.oneLiner ?? p.abstract ?? '';
  return `TL;DR — ${text}`;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');

  const items = category
    ? await db.select().from(papers).where(and(isNotNull(papers.summarizedAt), eq(papers.aiCategory, category))).orderBy(desc(papers.summarizedAt)).limit(50)
    : await db.select().from(papers).where(isNotNull(papers.summarizedAt)).orderBy(desc(papers.summarizedAt)).limit(50);

  const siteUrl = new URL(req.url).origin;

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Paper Digest</title>
    <link>${siteUrl}</link>
    <description>매일 업데이트되는 AI/LLM 논문 한글 요약</description>
    <language>ko</language>
    <atom:link href="${req.url}" rel="self" type="application/rss+xml"/>
    ${items.map(p => `
    <item>
      <title>${escapeXml(p.titleKo || p.title)}</title>
      <link>${p.arxivUrl}</link>
      <description>${escapeXml(buildDescription(p))}</description>
      <category>${p.aiCategory || 'other'}</category>
      <guid isPermaLink="false">${p.id}</guid>
      <pubDate>${new Date(p.summarizedAt!).toUTCString()}</pubDate>
    </item>`).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
