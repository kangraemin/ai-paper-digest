import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

const HF_API = 'https://huggingface.co/api/papers?limit=40';

interface HfPaper {
  id: string;
  title: string;
  summary: string;
  authors: { name: string }[];
  publishedAt: string;
  upvotes: number;
}

async function main() {
  console.log('📄 Fetching trending papers from Hugging Face...');

  const res = await fetch(HF_API);
  if (!res.ok) throw new Error(`HF API error: ${res.status}`);
  const hfPapers: HfPaper[] = await res.json();
  console.log(`Found ${hfPapers.length} papers`);

  // 스크리닝 전 중복 제거
  const newHfPapers = [];
  for (const p of hfPapers) {
    const existing = await db.select().from(papers).where(eq(papers.id, p.id)).limit(1);
    if (existing.length === 0) newHfPapers.push(p);
  }
  console.log(`[중복제거] ${hfPapers.length}개 중 ${newHfPapers.length}개 신규`);

  console.log('🔍 Screening papers...');
  const screenResults = await screenBatch(
    newHfPapers.map(p => ({
      id: p.id,
      title: p.title,
      abstract: p.summary ?? p.title,
    })),
    3,
    'hn'
  );

  const passed = newHfPapers
    .filter(p => screenResults.get(p.id)?.pass)
    .slice(0, 5);
  console.log(`[스크리닝] ${newHfPapers.length}편 중 ${passed.length}편 통과 (상위 3개)`);

  let newCount = 0;
  for (const paper of passed) {
    const id = paper.id;

    const hotScore = Math.min((screenResults.get(id)?.score ?? 5) * 10, 100);

    await db.insert(papers).values({
      id,
      title: paper.title,
      abstract: paper.summary ?? '',
      authors: JSON.stringify(paper.authors.map(a => a.name)),
      categories: JSON.stringify([]),
      primaryCategory: 'cs.AI',
      publishedAt: paper.publishedAt,
      arxivUrl: `https://arxiv.org/abs/${id}`,
      pdfUrl: `https://arxiv.org/pdf/${id}`,
      source: 'hugging_face',
      hotScore,
      isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();

    newCount++;
    console.log(`  ✅ 저장: ${paper.title.slice(0, 60)}`);
  }

  console.log(`\n완료: ${newCount}편 새로 저장`);
}

main().catch(console.error);
