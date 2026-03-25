---
name: collect
description: "⚠️ DEPRECATED — 이 스킬은 더 이상 사용하지 않는다. 수집/스크리닝/요약/번역은 기존 API 스크립트(collect-papers.ts, collect-community.ts, summarize.ts, digest-community.ts, translate.ts)를 직접 실행한다. 아래 내용은 레거시 참고용으로만 보존."
---

> ⚠️ **DEPRECATED**: 이 스킬은 레거시입니다. 아래 원래 API 기반 파이프라인을 사용하세요.

## 원래 API 파이프라인 (현재 사용)

```bash
# .env에 ANTHROPIC_API_KEY 포함되어야 함
source .env

# 수집 + 스크리닝
npx tsx scripts/collect-papers.ts
npx tsx scripts/collect-community.ts

# 요약
npx tsx scripts/summarize.ts
npx tsx scripts/digest-community.ts

# 번역
npx tsx scripts/translate.ts
```

---

## 레거시 내용 (참고용)

# collect 파이프라인

**Claude Code가 스크리닝/요약/번역을 직접 수행한다. API 호출(screenBatch, summarize 스크립트) 절대 사용 금지.**

⚠️ `collect-papers.ts`는 ANTHROPIC_API_KEY 없어도 screenBatch를 항상 실행하여 score=0으로 캐시 저장 후 0개 저장한다. 이 스크립트를 직접 실행하면 안 된다.

## 전제 조건

- 작업 디렉토리: `/Users/ram/programming/vibecoding/ai-paper`
- `.env`에 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 있어야 함
- `ANTHROPIC_API_KEY` 사용 금지 (스크리닝/요약/번역은 Claude가 직접)

## 실행 순서

### 1. 수집 (스크리닝 없이 전체 저장)

아래 스크립트를 `/tmp/collect-no-screen.ts`에 생성 후 실행:

```bash
cat > /tmp/collect-no-screen.ts << 'EOF'
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '/Users/ram/programming/vibecoding/ai-paper/src/lib/db/schema';
import { eq } from 'drizzle-orm';

const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
const db = drizzle(client, { schema });

const HF_API = 'https://huggingface.co/api/papers?limit=40';

async function main() {
  const { fetchRecentPapers } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/arxiv/client');
  const { calculateHotScore } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/hot-scorer');

  console.log('📄 arXiv 수집...');
  const arxivPapers = await fetchRecentPapers(100);
  let arxivSaved = 0;
  for (const p of arxivPapers) {
    const exists = await db.select().from(schema.papers).where(eq(schema.papers.id, p.id)).limit(1);
    if (exists.length > 0) continue;
    const hotScore = calculateHotScore(p);
    await db.insert(schema.papers).values({ ...p, authors: JSON.stringify(p.authors), categories: JSON.stringify(p.categories), hotScore, isHot: hotScore >= 70, collectedAt: new Date().toISOString() }).onConflictDoNothing();
    arxivSaved++;
  }
  console.log(`arXiv: ${arxivSaved}개 신규 저장`);

  console.log('📄 HuggingFace 수집...');
  const hfRes = await fetch(HF_API);
  const hfPapers: any[] = await hfRes.json();
  let hfSaved = 0;
  for (const p of hfPapers) {
    const exists = await db.select().from(schema.papers).where(eq(schema.papers.id, p.id)).limit(1);
    if (exists.length > 0) continue;
    await db.insert(schema.papers).values({ id: p.id, title: p.title, abstract: p.summary ?? '', authors: JSON.stringify((p.authors ?? []).map((a: any) => a.name)), categories: JSON.stringify([]), primaryCategory: 'cs.AI', publishedAt: p.publishedAt, arxivUrl: `https://arxiv.org/abs/${p.id}`, pdfUrl: `https://arxiv.org/pdf/${p.id}`, source: 'hugging_face', hotScore: 50, isHot: false, collectedAt: new Date().toISOString() }).onConflictDoNothing();
    hfSaved++;
  }
  console.log(`HuggingFace: ${hfSaved}개 신규 저장`);
}
main().catch(console.error);
EOF
export $(grep -E '^TURSO_' .env | xargs) && NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx /tmp/collect-no-screen.ts
```

커뮤니티(HN/Reddit) 수집 — 마찬가지로 no-screen 버전 사용:

```bash
cat > /tmp/collect-community-no-screen.ts << 'EOF'
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from '/Users/ram/programming/vibecoding/ai-paper/src/lib/db/schema';
import { eq } from 'drizzle-orm';

const client = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
const db = drizzle(client, { schema });

async function main() {
  const { fetchHNTopAI } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/hacker-news/client');
  const { fetchRedditAI } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/reddit/client');

  console.log('📰 HN 수집...');
  const stories = await fetchHNTopAI(100);
  let hnSaved = 0;
  for (const s of stories) {
    const id = 'hn_' + s.id;
    const exists = await db.select().from(schema.papers).where(eq(schema.papers.id, id)).limit(1);
    if (exists.length > 0) continue;
    const hotScore = Math.min(Math.floor(s.score / 5), 100);
    await db.insert(schema.papers).values({
      id, title: s.title, abstract: s.title,
      authors: JSON.stringify([s.by]), categories: JSON.stringify(['hacker_news']),
      primaryCategory: 'hacker_news',
      publishedAt: new Date(s.time * 1000).toISOString(),
      arxivUrl: s.url ?? 'https://news.ycombinator.com/item?id=' + s.id,
      pdfUrl: '', source: 'hacker_news', hotScore, isHot: hotScore >= 70,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    hnSaved++;
  }
  console.log('HN:', hnSaved, '개 저장');

  console.log('🔴 Reddit 수집...');
  const posts = await fetchRedditAI();
  let redditSaved = 0;
  for (const p of posts) {
    const id = 'reddit_' + p.subreddit + '_' + p.id;
    const exists = await db.select().from(schema.papers).where(eq(schema.papers.id, id)).limit(1);
    if (exists.length > 0) continue;
    await db.insert(schema.papers).values({
      id, title: p.title, abstract: p.selftext || p.title,
      authors: JSON.stringify([p.author]), categories: JSON.stringify(['reddit_' + p.subreddit]),
      primaryCategory: 'reddit_' + p.subreddit,
      publishedAt: new Date(p.created_utc * 1000).toISOString(),
      arxivUrl: p.url || 'https://www.reddit.com' + p.permalink,
      pdfUrl: '', source: 'reddit', hotScore: 50, isHot: false,
      collectedAt: new Date().toISOString(),
    }).onConflictDoNothing();
    redditSaved++;
  }
  console.log('Reddit:', redditSaved, '개 저장');
}
main().catch(console.error);
EOF
export $(grep -E '^TURSO_' .env | xargs) && NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx /tmp/collect-community-no-screen.ts
```

### 2. 수집된 논문 확인

```bash
export $(grep -E '^TURSO_' .env | xargs) && NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx -e "
(async () => {
  const { createClient } = await import('@libsql/client');
  const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
  const r = await client.execute('SELECT id, title, source, abstract FROM papers WHERE summarized_at IS NULL ORDER BY collected_at DESC');
  for (const row of r.rows) console.log('['+row.source+'] '+row.id+': '+String(row.title).slice(0,80));
  console.log('총:', r.rows.length, '개');
})();"
```

### 3. 스크리닝 (Claude가 직접)

수집된 논문 제목/내용을 보고 AI 개발자에게 유용하지 않은 것 삭제.

**PASS 기준**: AI 개발자가 즉시 적용 가능한 프롬프팅, 에이전트, 보안, 워크플로우 관련
**REJECT 기준**: 순수 수학, 모델 학습 이론, 의료/법률 도메인, 뉴스/공지만 있는 것

스크리닝 후 탈락 논문 DB에서 삭제:
```bash
export $(grep -E '^TURSO_' .env | xargs) && NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx -e "
(async () => {
  const { createClient } = await import('@libsql/client');
  const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
  const ids = ['id1', 'id2']; // 탈락 ID 목록
  for (const id of ids) {
    await client.execute({ sql: 'DELETE FROM papers WHERE id = ?', args: [id] });
  }
  console.log('삭제 완료:', ids.length, '개');
})();"
```

### 4. 요약 — 논문 vs 커뮤니티 분리 처리

**논문(arxiv/hugging_face)과 커뮤니티(hacker_news/reddit)는 처리 방식이 다르다.**

#### 4-A. 커뮤니티 요약 (Claude가 직접)

커뮤니티 아이템은 `digest-community.ts`를 사용하면 안 됨 (`runClaude()` = API 호출).

**원문 품질 보장이 핵심 — 이 단계를 건너뛰면 나중에 수동 재검증이 필요해진다.**

Claude가 직접 각 아이템에 대해:

1. 원문 fetch: `src/lib/content-fetcher.ts`의 `fetchContent(arxivUrl)` 실행
2. **원문 품질 체크 (필수)**:
   - 원문이 500자 미만이거나 네비게이션/보일러플레이트만 있으면 → **즉시 WebFetch 재시도**
   - `WebFetch(url, "Extract all technical details: what it does, how it works, key results, specific numbers")` 호출
   - WebFetch도 실패하거나 내용 없으면 → **WebSearch로 논문/블로그 검색**
   - Google Research·Anthropic·OpenAI 블로그·Reddit 포스트는 fetchContent 실패 확률 높음 — 처음부터 WebFetch 우선 고려
3. 댓글 fetch:
   - HN: `fetchHNComments(hnId, 15)` (공개 API)
   - Reddit: `fetchRedditComments(url, 15)` (공개 API)
4. 원문 + 댓글 전체 읽고 요약 작성 — **요약 전 반드시 충분한 기술 내용이 확보됐는지 확인**
5. DB UPDATE

이 단계를 제대로 하면 별도 품질 검증 불필요.

커뮤니티 아이템 조회:
```bash
export $(grep -E '^TURSO_' .env | xargs) && NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx -e "
(async () => {
  const { createClient } = await import('@libsql/client');
  const client = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
  const r = await client.execute(\"SELECT id, title, source, arxiv_url FROM papers WHERE summarized_at IS NULL AND source IN ('hacker_news','reddit') ORDER BY collected_at DESC\");
  for (const row of r.rows) console.log('['+row.source+'] '+row.id+': '+String(row.title).slice(0,80));
  console.log('총:', r.rows.length, '개');
})();"
```

원문+댓글 fetch 예시:
```typescript
// HN
const { fetchContent } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/content-fetcher');
const { fetchHNComments } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/hacker-news/client');
const content = await fetchContent(arxivUrl);
const hnId = parseInt(id.replace('hn_', ''));
const comments = await fetchHNComments(hnId, 15);
// content + comments 전부 읽고 직접 요약

// Reddit
const { fetchRedditComments } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/reddit/client');
const content = await fetchContent(arxivUrl);
const comments = await fetchRedditComments(arxivUrl, 15);
```

#### 4-B. 논문 요약 (에이전트 병렬)

미요약 논문 ID를 전부 조회 후 **10개 배치로 나눠 Agent 10개 병렬 스폰**.
각 에이전트는 자신의 배치 ID만 처리 (중복 없음).

**⚠️ 필수: 초록(abstract)만 읽으면 안 됨. 반드시 PDF 전문을 다운로드해서 읽고 요약할 것.**

**각 에이전트의 논문별 처리 순서:**
1. DB에서 `pdfUrl` 조회
2. `/tmp/pdf-{id}.ts` 스크립트로 PDF 전문 다운로드 후 `/tmp/pdf-{id}.txt`에 저장
3. **전문을 모두 읽고** 요약 작성 (아래 주의사항 필수)
4. DB UPDATE

⚠️ **PDF 전문 읽기 주의사항 (반드시 준수)**
- Read 도구는 한 번에 10,000 토큰(약 400줄) 제한이 있음
- 논문은 보통 800~2000줄 → **반드시 여러 번 Read해서 전체를 읽어야 함**
- 읽는 방법: `offset=1, limit=400` → `offset=401, limit=400` → `offset=801, limit=400` → 끝날 때까지 반복
- 먼저 파일의 총 줄 수를 파악한 후, 모든 섹션(서론, 방법론, 실험, 결과, 결론)을 빠짐없이 읽을 것
- 앞뒤만 읽고 요약하는 것은 **절대 금지**. 중간 실험/결과 섹션을 빠뜨리면 요약 품질이 심각하게 저하됨

PDF 저장 스크립트 예시:
```typescript
// /tmp/fetch-pdf-{id}.ts
const { fetchPdfText } = await import('/Users/ram/programming/vibecoding/ai-paper/src/lib/pdf-fetcher');
const fs = await import('fs');
const text = await fetchPdfText(pdfUrl);
fs.writeFileSync('/tmp/pdf-{id}.txt', text);
console.log('줄 수:', text.split('\n').length, '/ 글자수:', text.length);
```

실행: `NODE_PATH=/Users/ram/programming/vibecoding/ai-paper/node_modules npx tsx /tmp/fetch-pdf-{id}.ts`

읽기 반복 예시 (1200줄 논문의 경우):
- Read(`/tmp/pdf-{id}.txt`, offset=1, limit=400) → 서론/배경
- Read(`/tmp/pdf-{id}.txt`, offset=401, limit=400) → 방법론
- Read(`/tmp/pdf-{id}.txt`, offset=801, limit=400) → 결과/결론
→ 모두 읽은 후에만 요약 작성

**병렬 스폰 방법:**
1. `SELECT id, title, pdf_url FROM papers WHERE summarized_at IS NULL ORDER BY id` 로 미요약 논문 전체 조회
2. `Math.ceil(total / 10)` 씩 10개 배치 분할
3. Agent 10개 동시 스폰 (run_in_background: true)
4. 각 에이전트 프롬프트에 담당 ID 배열 + pdfUrl 명시

**PDF fetch 예시 (각 에이전트가 /tmp 스크립트로 실행):**
```typescript
import { fetchPdfText } from '/Users/ram/programming/vibecoding/ai-paper/src/lib/pdf-fetcher';
const fullText = await fetchPdfText(pdfUrl); // 최대 120,000자
// fullText 기반으로 요약 작성
```

요약 필드:
- `title_ko`: 한국어 제목
- `one_liner`: 한 줄 요약 (한국어)
- `target_audience`: 대상 독자 (한국어)
- `key_findings`: JSON array (한국어, 3-5개)
- `evidence`: JSON array (한국어, 2-3개)
- `how_to_apply`: JSON array (한국어, 2-3개)
- `glossary`: **JSON object** 형식 `{"용어": "설명", ...}` (한국어, 2-4개) — ⚠️ 절대 문자열 배열 사용 금지 (페이지 렌더링 깨짐)
- `tags`: JSON array - 허용값: ["에이전트","프롬프트엔지니어링","RAG","파인튜닝","코드생성","멀티모달","평가","벤치마크","보안","프롬프트인젝션","도구사용","함수호출","추론최적화","양자화","캐싱","레드팀","프라이버시","임베딩","벡터검색","청킹","MCP","LoRA","RLHF"]
- `ai_category`: "prompting"|"rag"|"agent"|"fine-tuning"|"eval"|"security"|"cost-speed"
- `dev_relevance`: 1-5 (개발자 관련도)
- `summarized_at`: new Date().toISOString()

UPDATE 쿼리:
```sql
UPDATE papers SET title_ko=?, one_liner=?, target_audience=?, key_findings=?, evidence=?, how_to_apply=?, glossary=?, tags=?, ai_category=?, dev_relevance=?, summarized_at=? WHERE id=?
```

### 5. 번역 (에이전트 병렬)

요약 완료 후 **동일하게 10개 배치로 나눠 Agent 10개 병렬 스폰**.
`SELECT id FROM papers WHERE summarized_at IS NOT NULL AND one_liner_en IS NULL ORDER BY id` 로 미번역 조회.

영어 번역 필드:
- `one_liner_en`, `target_audience_en`, `key_findings_en`, `evidence_en`, `how_to_apply_en`, `glossary_en`, `tags_en`

Tags 매핑: 에이전트→Agent, 프롬프트엔지니어링→Prompt Engineering, RAG→RAG, 파인튜닝→Fine-tuning, 코드생성→Code Generation, 멀티모달→Multimodal, 평가→Evaluation, 벤치마크→Benchmark, 보안→Security, 프롬프트인젝션→Prompt Injection, 도구사용→Tool Use, 함수호출→Function Calling, 추론최적화→Inference Optimization, 양자화→Quantization, 캐싱→Caching, 레드팀→Red Team, 프라이버시→Privacy, 임베딩→Embedding, 벡터검색→Vector Search, 청킹→Chunking, MCP→MCP, LoRA→LoRA, RLHF→RLHF

### 6. Vercel 재배포

```bash
vercel deploy --prod
```

### 7. 완료 보고

수집/스크리닝/요약/번역 각 단계 결과 요약 출력.
