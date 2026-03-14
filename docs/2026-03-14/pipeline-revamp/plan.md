# 논문 수집/스크리닝/요약 파이프라인 전면 개편

## Context
현재 arXiv에서 cs.AI/CL/LG 200편을 무차별 수집하여 개발자 무관 논문이 대량 포함됨. 타겟 독자는 "GPT/Claude API 쓰는 일반 개발자"이므로, 수집 단계 필터링 + haiku 스크리닝 + 요약 양식 7항목 재설계가 필요.

## 변경 파일 총 12개

### Phase 1: 수집 필터링 (3파일)

#### 1-1. `src/lib/arxiv/client.ts`
- **Before**: `cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG` 카테고리만으로 검색
- **After**: `(카테고리) AND (실무 키워드)` 복합 쿼리
```typescript
const PRACTICAL_KEYWORDS = [
  'prompting', 'prompt engineering', 'RAG', 'retrieval-augmented',
  'agent', 'tool use', 'function calling', 'fine-tuning', 'LoRA',
  'RLHF', 'DPO', 'inference', 'quantization', 'distillation',
  'eval', 'benchmark', 'code generation', 'in-context learning',
  'chain-of-thought', 'embedding', 'chunking', 'vector search',
];
// 쿼리: (cat:cs.AI OR ...) AND (abs:prompting OR abs:RAG OR ...)
```

#### 1-2. `src/lib/hot-scorer.ts`
- **Before**: BUZZ_KEYWORDS에 'scaling', 'SOTA' 등 범용 키워드
- **After**: 실무 키워드로 교체 (prompting, RAG, tool use, function calling, fine-tuning, LoRA, quantization, code generation, inference 등)

#### 1-3. `scripts/collect.ts`
- **Before**: `fetchRecentPapers(200)`
- **After**: `fetchRecentPapers(100)` (키워드 필터로 정밀도 상승)

### Phase 2: 스크리닝 (3파일)

#### 2-1. `src/lib/claude/screener.ts` (신규)
```typescript
export async function screenPaper(title: string, abstract: string): Promise<{ pass: boolean; reason: string }>
export async function screenBatch(papers: Array<{title: string; abstract: string}>, concurrency?: number): Promise<Map<string, { pass: boolean; reason: string }>>
```
- 모델: claude-haiku-4-5-20251001, max_tokens: 100
- 영어 프롬프트 (토큰 절약): "Is this paper useful for developers who build apps using GPT/Claude APIs? Answer JSON: {pass, reason}"
- 비용: ~$0.003/100편

#### 2-2. `scripts/collect.ts` (추가 수정)
- **Before**: fetch → DB insert
- **After**: fetch → `screenBatch()` → pass만 DB insert
- 스크리닝 결과 로그 출력: `[스크리닝] 100편 중 35편 통과`

#### 2-3. `.github/workflows/collect.yml`
- collect 단계에 `ANTHROPIC_API_KEY` env 추가

### Phase 3: 요약 양식 재설계 (6파일)

#### 3-1. `src/lib/claude/types.ts`
- **Before**:
```typescript
export interface SummaryResult {
  titleKo: string; summaryKo: string; aiCategory: string;
  devRelevance: number; relevanceReason: string; devNote: string;
}
```
- **After**:
```typescript
export interface SummaryResult {
  titleKo: string;
  oneLiner: string;             // 한줄 요약
  targetAudience: string;       // 누가 읽으면 좋은지
  keyFindings: string;          // 주요 내용
  evidence: string;             // 근거
  howToApply: string;           // 적용 방법
  codeExample: string;          // 바로 써보기
  relatedResources: string[];   // 관련 리소스
  aiCategory: string;
  devRelevance: number;
}
```

#### 3-2. `src/lib/db/schema.ts`
- 신규 컬럼 7개 추가 (nullable text):
  `oneLiner`, `targetAudience`, `keyFindings`, `evidence`, `howToApply`, `codeExample`, `relatedResources`
- 기존 `summaryKo`, `devNote`, `relevanceReason` 컬럼은 유지 (하위 호환)

#### 3-3. `src/lib/claude/prompts.ts`
- 전면 재작성: 7가지 항목 구조 + 개발자 슬랙 톤 + 코드 예시 필수
- 톤 규칙 유지 (논문체 금지, 모델명 명시 등)

#### 3-4. `src/lib/claude/client.ts`
- `max_tokens: 500` → `max_tokens: 2000`

#### 3-5. `scripts/summarize.ts` + `scripts/summarize-local.ts`
- DB update 시 새 필드 저장
- 필드 검증 로직 업데이트

#### 3-6. `scripts/summarize-claude.sh`
- Python 내 JSON 필수 필드 검증을 새 필드로 교체

### Phase 4: 프론트엔드 (4파일)

#### 4-1. `src/components/paper-card.tsx`
- `PaperCardProps`: `summaryKo` → `oneLiner`, `devNote` → `targetAudience`
- 카드에 `oneLiner` 표시, `targetAudience`를 강조 텍스트로

#### 4-2. `src/app/papers/[id]/page.tsx`
- "한글 요약" 단일 섹션 → 7가지 항목별 섹션 분리
- `codeExample`은 `<pre>` 코드 블록으로 렌더링
- `relatedResources`는 링크 리스트

#### 4-3. `src/app/page.tsx` + `src/app/bookmarks/page.tsx`
- PaperCard에 전달하는 props를 새 필드로 교체

#### 4-4. `src/app/api/rss/route.ts`
- `description`에 `oneLiner` 사용

#### 4-5. `src/lib/db/queries.ts`
- 검색 대상에 `keyFindings` 추가

### Phase 5: 기존 DB 데이터 정리

#### 5-1. `scripts/cleanup-papers.ts` (신규)
기존 DB에 이미 들어있는 ~200편의 논문을 haiku 스크리닝으로 재검수:
- 모든 논문의 abstract를 `screenBatch()`로 판별
- `pass: false`인 논문은 DB에서 삭제 (`DELETE FROM papers WHERE id = ?`)
- 이미 요약된 논문도 예외 없이 스크리닝 (무관한 논문이면 삭제)
- 실행: `set -a && source .env && set +a && npx tsx scripts/cleanup-papers.ts`
- 로그: `[정리] 총 N편 중 M편 유지, K편 삭제` (실제 수치는 스크리닝 결과에 따라 결정)

이 스크립트는 1회성이지만, 나중에 기준이 바뀔 때 재사용 가능하도록 남겨둠.

## E2E 검증

### Step 1: 타입 체크
```bash
npx tsc --noEmit
```
- 기대: 에러 0

### Step 2: DB 마이그레이션
```bash
set -a && source .env && set +a && npx drizzle-kit push
```
- 기대: 7개 신규 컬럼 추가 성공, 기존 데이터 유지

### Step 3: 수집 필터링 확인
```bash
set -a && source .env && set +a && npx tsx -e "
import { fetchRecentPapers } from './src/lib/arxiv/client';
fetchRecentPapers(10).then(papers => {
  papers.forEach(p => console.log(p.id, p.title.slice(0, 80)));
  console.log('---');
  console.log('총', papers.length, '편');
});
"
```
- 기대: 반환된 논문 제목에 prompting/RAG/agent/fine-tuning 등 실무 키워드 포함

### Step 4: 스크리닝 확인
```bash
set -a && source .env && set +a && npx tsx -e "
import { screenPaper } from './src/lib/claude/screener';
screenPaper(
  'Latent Color Subspace: Emergent Order in High-Dimensional Chaos',
  'Text-to-image generation models ... fine-grained control over generated images ...'
).then(r => console.log('pass:', r.pass, 'reason:', r.reason));
"
```
- 기대: `pass: false` (이미지 생성 모델 내부 구조 → API 개발자 무관)

```bash
set -a && source .env && set +a && npx tsx -e "
import { screenPaper } from './src/lib/claude/screener';
screenPaper(
  'Prompt Engineering Best Practices for GPT-4',
  'We systematically evaluate prompt engineering techniques for GPT-4 API ...'
).then(r => console.log('pass:', r.pass, 'reason:', r.reason));
"
```
- 기대: `pass: true`

### Step 5: 요약 양식 확인 (1편)
```bash
set -a && source .env && set +a && SUMMARIZE_LIMIT=1 bash scripts/summarize-claude.sh
```
- 기대: JSON 응답에 7가지 필드 모두 존재
  - `oneLiner`: 비어있지 않음
  - `targetAudience`: 구체적 독자 상황
  - `keyFindings`: 2문단 이상
  - `evidence`: 숫자/실험 결과 포함
  - `howToApply`: 실무 적용 방법
  - `codeExample`: 코드/프롬프트 스니펫 (해당되는 경우)
  - `relatedResources`: GitHub 링크 등 (논문에 있는 경우)

### Step 6: 기존 DB 정리
```bash
set -a && source .env && set +a && npx tsx scripts/cleanup-papers.ts
```
- 기대: 로그에 유지/삭제 편수 출력, 삭제된 논문은 DB에서 조회 안 됨

### Step 7: 프론트엔드 빌드
```bash
npm run build
```
- 기대: 빌드 성공, 에러 0

### Step 8: 프론트엔드 렌더링
```bash
npm run dev
```
- 확인 사항:
  - 메인 페이지: PaperCard에 `oneLiner` 표시
  - 상세 페이지 (`/papers/{id}`): 7가지 항목 섹션별 렌더링
  - `codeExample` 코드 블록 표시
  - `relatedResources` 링크 클릭 가능
  - 북마크 페이지: 정상 동작
  - RSS (`/api/rss`): `oneLiner`가 description에 포함
