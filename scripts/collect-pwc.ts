import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

const HF_API = 'https://huggingface.co/api/papers?limit=10';

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

  console.log('🔍 Screening papers...');
  const screenResults = await screenBatch(
    hfPapers.map(p => ({
      id: p.id,
      title: p.title,
      abstract: p.summary ?? p.title,
    }))
  );

  const passed = hfPapers
    .filter(p => screenResults.get(p.id)?.pass)
    .slice(0, 3);
  console.log(`[스크리닝] ${hfPapers.length}편 중 ${passed.length}편 통과 (상위 3개)`);

  let newCount = 0;
  for (const paper of passed) {
    const id = paper.id;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) {
      console.log(`  이미 존재: ${id}`);
      continue;
    }

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
      source: 'papers_with_code',
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
