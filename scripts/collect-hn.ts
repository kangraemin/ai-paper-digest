import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchHNTopAI } from '../src/lib/hacker-news/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

async function main() {
  console.log('📰 Fetching AI stories from Hacker News...');
  const stories = await fetchHNTopAI(30);
  console.log(`Found ${stories.length} AI-related HN stories`);

  // Claude 스크리닝 (기존 screener 재사용)
  console.log('🔍 Screening stories...');
  const screenResults = await screenBatch(
    stories.map(s => ({ id: `hn_${s.id}`, title: s.title, abstract: s.title }))
  );
  const passed = stories.filter(s => screenResults.get(`hn_${s.id}`)?.pass);
  console.log(`[스크리닝] ${stories.length}편 중 ${passed.length}편 통과`);

  let newCount = 0;
  for (const story of passed) {
    const id = `hn_${story.id}`;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) continue;

    const hotScore = Math.min(Math.floor(story.score / 5), 100);
    await db.insert(papers).values({
      id,
      title: story.title,
      abstract: story.title,
      authors: JSON.stringify([story.by]),
      categories: JSON.stringify(['hacker_news']),
      primaryCategory: 'hacker_news',
      publishedAt: new Date(story.time * 1000).toISOString(),
      arxivUrl: story.url ?? `https://news.ycombinator.com/item?id=${story.id}`,
      pdfUrl: '',
      source: 'hacker_news',
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`✅ HN: ${passed.length} stories, ${newCount} new`);
}

main().catch(console.error);
