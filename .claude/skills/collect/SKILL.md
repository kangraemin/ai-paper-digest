---
name: collect
description: ai-paper-digest 프로젝트에서 논문/커뮤니티 콘텐츠 수집 → 스크리닝 → 요약 → 번역 전체 파이프라인을 Claude Code가 직접 수행. "collect", "수집", "오늘 논문", "논문 가져와", "논문 수집해" 등의 요청 시 반드시 이 스킬을 사용할 것. ANTHROPIC_API_KEY 없이 에이전트 기반으로 전체 파이프라인을 처리한다.
---

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

커뮤니티(HN/Reddit) 수집:
```bash
export $(grep -E '^TURSO_' .env | xargs) && npx tsx scripts/collect-community.ts
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

### 4. 요약 (에이전트 병렬)

미요약 논문 ID를 전부 조회 후 **10개 배치로 나눠 Agent 10개 병렬 스폰**.
각 에이전트는 자신의 배치 ID만 처리 (중복 없음).

**⚠️ 필수: 초록(abstract)만 읽으면 안 됨. 반드시 PDF 전문을 다운로드해서 읽고 요약할 것.**

**각 에이전트의 논문별 처리 순서:**
1. DB에서 `pdfUrl` 조회
2. `src/lib/pdf-fetcher.ts`의 `fetchPdfText(pdfUrl)` 로 PDF 전문 다운로드 (최대 120,000자)
3. 전문 기반으로 요약 작성
4. DB UPDATE

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
- `glossary`: JSON array (한국어, 2-4개)
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
