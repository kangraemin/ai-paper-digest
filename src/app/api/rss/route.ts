import { db } from '@/lib/db';
import { papers } from '@/lib/db/schema';
import { desc, eq, and, isNotNull } from 'drizzle-orm';

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function parseBulletList(value: string | null): string[] {
  if (!value) return [];
  try { const arr = JSON.parse(value); if (Array.isArray(arr)) return arr; } catch {}
  return value.split('\n').filter(l => l.trim()).map(l => l.replace(/^-\s*/, ''));
}

function buildDescription(p: typeof papers.$inferSelect, pageUrl: string): string {
  const parts: string[] = [];

  const tldr = p.oneLiner ?? p.abstract ?? '';
  if (tldr) parts.push(`TL;DR\n${tldr}`);

  const findings = parseBulletList(p.keyFindings);
  if (findings.length > 0) {
    parts.push(`Core Mechanics\n${findings.map(f => `- ${f}`).join('\n')}`);
  }

  const applies = parseBulletList(p.howToApply);
  if (applies.length > 0) {
    parts.push(`How to apply\n${applies.map(a => `- ${a}`).join('\n')}`);
  }

  parts.push(`더보기... ${pageUrl}`);
  return parts.join('\n\n');
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get('category');
  const langRaw = searchParams.get('lang');
  const lang = langRaw === 'en' ? 'en' : 'ko';

  const items = category
    ? await db.select().from(papers).where(and(isNotNull(papers.summarizedAt), eq(papers.aiCategory, category))).orderBy(desc(papers.summarizedAt)).limit(50)
    : await db.select().from(papers).where(isNotNull(papers.summarizedAt)).orderBy(desc(papers.summarizedAt)).limit(50);

  const siteUrl = new URL(req.url).origin;
  const channelDesc = lang === 'en'
    ? 'Daily AI/LLM paper summaries'
    : '매일 업데이트되는 AI/LLM 논문 한글 요약';

  const rssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>AI Paper Digest</title>
    <link>${siteUrl}/${lang}</link>
    <description>${escapeXml(channelDesc)}</description>
    <language>${lang}</language>
    <atom:link href="${req.url}" rel="self" type="application/rss+xml"/>
    ${items.map(p => {
      const itemTitle = lang === 'en' ? (p.title || p.titleKo || '') : (p.titleKo || p.title || '');
      const pageUrl = `${siteUrl}/${lang}/papers/${p.id}`;
      return `
    <item>
      <title>${escapeXml(itemTitle)}</title>
      <link>${pageUrl}</link>
      <description><![CDATA[${buildDescription(p, pageUrl)}]]></description>
      <category>${p.aiCategory || 'other'}</category>
      <guid isPermaLink="false">${p.id}</guid>
      <pubDate>${new Date(p.summarizedAt!).toUTCString()}</pubDate>
    </item>`;
    }).join('')}
  </channel>
</rss>`;

  return new Response(rssXml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
