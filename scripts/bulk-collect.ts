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
  }

  console.log(`\n🔬 S2 벌크 수집 완료: 총 ${totalNew}편 신규`);
}

async function collectHN() {
  // Phase 3 Step 2에서 구현
  console.log('📰 HN 수집은 아직 미구현');
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
