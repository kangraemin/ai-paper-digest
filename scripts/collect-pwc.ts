import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

const PWC_API = 'https://paperswithcode.com/api/v1/papers/?ordering=-trending&items_per_page=10';

interface PwcPaper {
  arxiv_id: string | null;
  title: string;
  abstract: string;
  authors: { name: string }[];
  url_abs: string;
  url_pdf: string;
  published: string;
  tasks: { name: string }[];
}

async function main() {
  console.log('📄 Fetching trending papers from Papers With Code...');

  const res = await fetch(PWC_API);
  if (!res.ok) throw new Error(`PWC API error: ${res.status}`);
  const data = await res.json();
  const pwcPapers: PwcPaper[] = data.results ?? [];
  console.log(`Found ${pwcPapers.length} papers`);

  const candidates = pwcPapers.filter(p => p.arxiv_id);

  console.log('🔍 Screening papers...');
  const screenResults = await screenBatch(
    candidates.map(p => ({
      id: p.arxiv_id!,
      title: p.title,
      abstract: p.abstract ?? p.title,
    }))
  );

  const passed = candidates
    .filter(p => screenResults.get(p.arxiv_id!)?.pass)
    .slice(0, 3);
  console.log(`[스크리닝] ${candidates.length}편 중 ${passed.length}편 통과 (상위 3개)`);

  let newCount = 0;
  for (const paper of passed) {
    const id = paper.arxiv_id!;
    const existing = await db.select().from(papers).where(eq(papers.id, id)).limit(1);
    if (existing.length > 0) {
      console.log(`  이미 존재: ${id}`);
      continue;
    }

    const tasks = paper.tasks.map(t => t.name);
    const hotScore = Math.min((screenResults.get(id)?.score ?? 5) * 10, 100);

    await db.insert(papers).values({
      id,
      title: paper.title,
      abstract: paper.abstract ?? '',
      authors: JSON.stringify(paper.authors.map(a => a.name)),
      categories: JSON.stringify(tasks),
      primaryCategory: tasks[0] ?? 'other',
      publishedAt: paper.published ? `${paper.published}T00:00:00Z` : new Date().toISOString(),
      arxivUrl: paper.url_abs || `https://arxiv.org/abs/${id}`,
      pdfUrl: paper.url_pdf || `https://arxiv.org/pdf/${id}`,
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
