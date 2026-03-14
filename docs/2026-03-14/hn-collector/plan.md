# Hacker News AI 콘텐츠 수집 파이프라인 추가

## 변경 파일별 상세

### `src/lib/claude/screener.ts`
- **변경 이유**: screener 모델을 opus로 변경
- **Before** (현재 코드):
```typescript
    const proc = spawn('claude', ['-p', '--model', 'haiku'], {
```
- **After** (변경 후):
```typescript
    const proc = spawn('claude', ['-p', '--model', 'opus'], {
```
- **영향 범위**: 모든 스크리닝 호출 (collect.ts, collect-hn.ts)

### `src/lib/hacker-news/client.ts`
- **변경 이유**: HN API 클라이언트 신규 생성
- **용도**: HN Firebase API에서 top stories 가져와 AI 키워드 + 점수로 필터
- **핵심 코드**:
```typescript
const HN_API = 'https://hacker-news.firebaseio.com/v0';

interface HNItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
  type: string;
}

const AI_KEYWORDS = [
  'AI', 'LLM', 'GPT', 'Claude', 'machine learning', 'deep learning',
  'neural', 'transformer', 'language model', 'ChatGPT', 'OpenAI',
  'Anthropic', 'RAG', 'agent', 'fine-tuning', 'embedding', 'prompt',
  'diffusion', 'Gemini', 'Llama', 'Mistral',
];

export async function fetchHNTopAI(limit = 30): Promise<HNItem[]> {
  const res = await fetch(`${HN_API}/topstories.json`);
  const ids: number[] = await res.json();

  const items: HNItem[] = await Promise.all(
    ids.slice(0, 200).map(id =>
      fetch(`${HN_API}/item/${id}.json`).then(r => r.json())
    )
  );

  return items
    .filter(item =>
      item && item.type === 'story' && item.score >= 50 &&
      AI_KEYWORDS.some(kw => item.title.toLowerCase().includes(kw.toLowerCase()))
    )
    .slice(0, limit);
}
```

### `scripts/collect-hn.ts`
- **변경 이유**: HN 수집 스크립트 신규 생성
- **용도**: HN에서 AI 관련 스토리 수집 → 스크리닝 → DB 저장
- **핵심 코드**:
```typescript
import { db } from '../src/lib/db';
import { papers } from '../src/lib/db/schema';
import { fetchHNTopAI } from '../src/lib/hacker-news/client';
import { screenBatch } from '../src/lib/claude/screener';
import { eq } from 'drizzle-orm';

async function main() {
  const stories = await fetchHNTopAI(30);
  console.log(`Found ${stories.length} AI-related HN stories`);

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
```

### `.github/workflows/collect.yml`
- **변경 이유**: HN 수집 step 추가
- **Before**:
```yaml
      - name: Collect popular papers from Semantic Scholar
        run: npx tsx scripts/collect-popular.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: Summarize with Claude
```
- **After**:
```yaml
      - name: Collect popular papers from Semantic Scholar
        run: npx tsx scripts/collect-popular.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}

      - name: Collect AI stories from Hacker News
        run: npx tsx scripts/collect-hn.ts
        env:
          TURSO_DATABASE_URL: ${{ secrets.TURSO_DATABASE_URL }}
          TURSO_AUTH_TOKEN: ${{ secrets.TURSO_AUTH_TOKEN }}
          ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}

      - name: Summarize with Claude
```

## 검증
- 검증 명령어: `npx tsx scripts/collect-hn.ts`
- 기대 결과: HN에서 AI 관련 스토리 수집, 스크리닝 통과한 항목 DB 저장, `source='hacker_news'` 확인
