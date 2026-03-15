import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { like, eq, and } from 'drizzle-orm';
import { XMLParser } from 'fast-xml-parser';

const ARXIV_API = 'https://export.arxiv.org/api/query';

async function fetchArxivDates(ids: string[]): Promise<Map<string, string>> {
  const url = `${ARXIV_API}?id_list=${ids.join(',')}&max_results=${ids.length}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`arXiv API error: ${res.status}`);

  const xml = await res.text();
  const parser = new XMLParser({ ignoreAttributes: false });
  const parsed = parser.parse(xml);
  const entries = parsed.feed?.entry;
  if (!entries) return new Map();

  const result = new Map<string, string>();
  for (const entry of (Array.isArray(entries) ? entries : [entries])) {
    const rawId = String(entry.id ?? '');
    const id = rawId.split('/abs/').pop()?.replace(/v\d+$/, '') ?? rawId;
    const publishedAt = String(entry.published ?? '');
    if (id && publishedAt) result.set(id, publishedAt);
  }
  return result;
}

async function main() {
  const wrongPapers = await db.select({ id: papers.id, publishedAt: papers.publishedAt })
    .from(papers)
    .where(and(
      eq(papers.source, 'semantic_scholar'),
      like(papers.publishedAt, '%-01-01T%')
    ));

  const arxivPapers = wrongPapers.filter(p => /^\d{4}\.\d{4,5}/.test(p.id));
  console.log(`총 ${wrongPapers.length}편 중 arXiv ID: ${arxivPapers.length}편`);

  const BATCH = 100;
  let updated = 0;

  for (let i = 0; i < arxivPapers.length; i += BATCH) {
    const batch = arxivPapers.slice(i, i + BATCH);
    const ids = batch.map(p => p.id);
    console.log(`배치 ${Math.floor(i / BATCH) + 1}: ${ids.length}편 조회...`);

    const dates = await fetchArxivDates(ids);

    for (const [id, publishedAt] of dates) {
      if (publishedAt && !publishedAt.includes('-01-01T')) {
        await db.update(papers).set({ publishedAt }).where(eq(papers.id, id));
        updated++;
      }
    }

    if (i + BATCH < arxivPapers.length) {
      await new Promise(r => setTimeout(r, 3000));
    }
  }

  console.log(`✅ 완료: ${updated}편 날짜 업데이트`);
}

main().catch(console.error);
