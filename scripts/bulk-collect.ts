import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchAllPapersForYear } from '../src/lib/semantic-scholar/client';
import { fetchHNStoriesAlgolia } from '../src/lib/hacker-news/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

const args = process.argv.slice(2);
const s2Only = args.includes('--s2-only');
const hnOnly = args.includes('--hn-only');
const dryRun = args.includes('--dry-run');

const S2_YEARS = [
  { year: 2022, maxPapers: 30 },
  { year: 2023, maxPapers: 30 },
  { year: 2024, maxPapers: 30 },
  { year: 2025, maxPapers: 500 },
  { year: 2026, maxPapers: 500 },
];

async function collectS2() {
  console.log('🔬 Semantic Scholar 벌크 수집 시작...');
  let totalNew = 0;

  for (const { year, maxPapers } of S2_YEARS) {
    console.log(`\n📅 ${year}년 (최대 ${maxPapers}편)...`);
    const fetched = await fetchAllPapersForYear(year, maxPapers);
    console.log(`  수집: ${fetched.length}편`);

    // 스크리닝
    console.log('  🔍 스크리닝...');
    const screenResults = await screenBatch(
      fetched.map(p => ({
        id: p.externalIds?.ArXiv ?? p.paperId,
        title: p.title,
        abstract: p.abstract ?? p.title,
      }))
    );
    const passed = fetched.filter(p => {
      const id = p.externalIds?.ArXiv ?? p.paperId;
      return screenResults.get(id)?.pass;
    });
    console.log(`  스크리닝 통과: ${passed.length}편`);

    if (dryRun) {
      console.log(`  [dry-run] DB 저장 스킵`);
      continue;
    }

    // DB 저장
    let newCount = 0;
    for (const paper of passed) {
      const arxivId = paper.externalIds?.ArXiv;
      const id = arxivId ?? paper.paperId;

      const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
      if (existing.length > 0) {
        await db.update(papers).set({ citationCount: paper.citationCount }).where(eq(papers.id, id));
        continue;
      }

      await db.insert(papers).values({
        id,
        title: paper.title,
        abstract: paper.abstract ?? '',
        authors: JSON.stringify(paper.authors.map(a => a.name)),
        categories: JSON.stringify(paper.fieldsOfStudy ?? []),
        primaryCategory: paper.fieldsOfStudy?.[0] ?? 'other',
        publishedAt: `${paper.year}-01-01T00:00:00Z`,
        arxivUrl: arxivId ? `https://arxiv.org/abs/${arxivId}` : `https://www.semanticscholar.org/paper/${paper.paperId}`,
        pdfUrl: arxivId ? `https://arxiv.org/pdf/${arxivId}` : '',
        source: 'semantic_scholar',
        citationCount: paper.citationCount,
        hotScore: 80,
        isHot: true,
        collectedAt: new Date().toISOString(),
      }).onConflictDoNothing();
      newCount++;
    }
    totalNew += newCount;
    console.log(`  ✅ ${year}년: ${passed.length}편 중 ${newCount}편 신규 저장`);
    // 연도 간 딜레이 — 레이트 리밋 방지
    await new Promise(r => setTimeout(r, 120_000));
  }

  console.log(`\n🔬 S2 벌크 수집 완료: 총 ${totalNew}편 신규`);
}

async function collectHN() {
  console.log('📰 HN Algolia 벌크 수집 시작...');

  const stories = await fetchHNStoriesAlgolia({ daysBack: 240, minScore: 50, maxPages: 50 });
  console.log(`  수집: ${stories.length}편`);

  // 스크리닝
  console.log('  🔍 스크리닝...');
  const screenResults = await screenBatch(
    stories.map(s => ({ id: `hn_${s.objectID}`, title: s.title, abstract: s.title }))
  );
  const passed = stories.filter(s => screenResults.get(`hn_${s.objectID}`)?.pass);
  console.log(`  스크리닝 통과: ${passed.length}편`);

  if (dryRun) {
    console.log(`  [dry-run] DB 저장 스킵`);
    return;
  }

  // DB 저장
  let newCount = 0;
  for (const story of passed) {
    const id = `hn_${story.objectID}`;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) continue;

    const hotScore = Math.min(Math.floor(story.points / 5), 100);
    await db.insert(papers).values({
      id,
      title: story.title,
      abstract: story.title,
      authors: JSON.stringify([story.author]),
      categories: JSON.stringify(['hacker_news']),
      primaryCategory: 'hacker_news',
      publishedAt: new Date(story.created_at_i * 1000).toISOString(),
      arxivUrl: story.url ?? `https://news.ycombinator.com/item?id=${story.objectID}`,
      pdfUrl: '',
      source: 'hacker_news',
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    newCount++;
  }

  console.log(`  ✅ HN: ${passed.length}편 중 ${newCount}편 신규 저장`);
}

async function main() {
  console.log('🚀 벌크 수집 시작');
  if (dryRun) console.log('  [dry-run 모드]');
  if (s2Only) console.log('  [S2 전용]');
  if (hnOnly) console.log('  [HN 전용]');

  if (!hnOnly) await collectS2();
  if (!s2Only) await collectHN();

  console.log('\n🎉 벌크 수집 완료');
}

main().catch(console.error);
