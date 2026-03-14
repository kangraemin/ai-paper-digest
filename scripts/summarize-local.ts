import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { eq, isNull } from 'drizzle-orm';
import { readFileSync } from 'fs';

const args = process.argv.slice(2);
const mode = args.includes('--dump') ? 'dump' : args.includes('--update') ? 'update' : null;
const limitIdx = args.indexOf('--limit');
const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1]) : 10;

async function dump() {
  const unsummarized = await db.select({
    id: papers.id,
    title: papers.title,
    abstract: papers.abstract,
  }).from(papers)
    .where(isNull(papers.summarizedAt))
    .limit(limit);
  console.log(JSON.stringify(unsummarized, null, 2));
  console.error(`${unsummarized.length} papers dumped`);
}

async function update() {
  const filePath = args[args.length - 1];
  const input = readFileSync(filePath, 'utf-8');
  const results: Array<{
    id: string; titleKo: string; summaryKo: string;
    aiCategory: string; devRelevance: number;
    relevanceReason: string; devNote: string;
  }> = JSON.parse(input);

  for (const r of results) {
    await db.update(papers).set({
      titleKo: r.titleKo,
      summaryKo: r.summaryKo,
      aiCategory: r.aiCategory,
      devRelevance: r.devRelevance,
      relevanceReason: r.relevanceReason,
      devNote: r.devNote,
      summarizedAt: new Date().toISOString(),
    }).where(eq(papers.id, r.id));
  }
  console.log(`Updated ${results.length} papers`);
}

if (mode === 'dump') dump().catch(console.error);
else if (mode === 'update') update().catch(console.error);
else console.log('Usage: --dump [--limit N] | --update <file.json>');
