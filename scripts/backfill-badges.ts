import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, and, or, isNull } from 'drizzle-orm';

const S2_BATCH_API = 'https://api.semanticscholar.org/graph/v1/paper/batch';
const BATCH_SIZE = 100;
const RATE_LIMIT_MS = 1000;

interface S2BatchPaper {
  paperId: string;
  venue?: string;
  authors?: { name: string; affiliations?: string[] }[];
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchBatch(ids: string[]): Promise<S2BatchPaper[]> {
  const res = await fetch(`${S2_BATCH_API}?fields=venue,authors,authors.affiliations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ids }),
  });

  if (res.status === 429) {
    console.log('  [S2] 429 레이트 리밋 — 60초 대기 후 재시도');
    await sleep(60_000);
    return fetchBatch(ids);
  }

  if (!res.ok) {
    throw new Error(`S2 batch API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

async function main() {
  console.log('🔄 S2 논문 venue/affiliations 백필 시작...');

  const rows = await db
    .select({ id: papers.id })
    .from(papers)
    .where(
      and(
        eq(papers.source, 'semantic_scholar'),
        or(isNull(papers.venue), isNull(papers.affiliations))
      )
    );

  console.log(`  백필 대상: ${rows.length}편`);

  if (rows.length === 0) {
    console.log('  백필 대상 없음. 종료.');
    return;
  }

  const ids = rows.map(r => r.id);

  let updated = 0;
  for (let i = 0; i < ids.length; i += BATCH_SIZE) {
    const batch = ids.slice(i, i + BATCH_SIZE);
    console.log(`  배치 ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length}편 조회...`);

    let results: S2BatchPaper[];
    try {
      results = await fetchBatch(batch);
    } catch (e) {
      console.error(`  ❌ 배치 실패 (스킵): ${(e as Error).message}`);
      continue;
    }

    for (const paper of results) {
      if (!paper || !paper.paperId) continue;

      const venue = paper.venue || null;
      const affiliations = paper.authors
        ? JSON.stringify([...new Set(paper.authors.flatMap(a => a.affiliations ?? []))])
        : null;

      const matchId = ids.find(id => id === paper.paperId) ?? paper.paperId;

      await db
        .update(papers)
        .set({ venue, affiliations })
        .where(eq(papers.id, matchId));

      updated++;
    }

    console.log(`  ✅ 배치 완료: ${results.filter(Boolean).length}편 업데이트`);

    if (i + BATCH_SIZE < ids.length) {
      await sleep(RATE_LIMIT_MS);
    }
  }

  console.log(`\n🔄 백필 완료: 총 ${updated}편 업데이트`);
}

main().catch(console.error);
