# 프롬프트 개선: devNote + relevanceReason 추가

## 배경
현재 논문 요약은 `summaryKo`(한글 요약) + `devRelevance`(1~5 점수)만 제공한다.
이것만으로는:
- 점수가 **왜** 이 값인지 알 수 없음 → 사용자 신뢰 부족
- 단순 요약은 다른 Paper Digest 서비스와 차별점 없음
- **"이 논문을 왜 읽어야 하는지"** 개발자 시점 코멘트가 없음

## 목표
1. `relevanceReason` — devRelevance 점수의 근거 한 줄 (예: "RAG 파이프라인의 chunk 전략을 실험적으로 비교 분석")
2. `devNote` — 개발자 시점 "왜 읽어야 하는지" 한 줄 코멘트 (예: "RAG 시스템 구축 중이라면 chunk 크기 512 vs 1024 비교 결과가 바로 적용 가능")

## Claude 응답 예시 (Before → After)

### Before (현재)
```json
{
  "titleKo": "대규모 언어 모델을 위한 효율적 RAG 전략",
  "summaryKo": "이 논문은 RAG에서 chunk 크기와 overlap 전략이 검색 성능에 미치는 영향을 체계적으로 분석한다. 512, 1024, 2048 토큰 크기와 다양한 overlap 비율을 실험하여, 도메인별 최적 설정을 제시한다.",
  "aiCategory": "nlp",
  "devRelevance": 5
}
```

### After (변경 후)
```json
{
  "titleKo": "대규모 언어 모델을 위한 효율적 RAG 전략",
  "summaryKo": "이 논문은 RAG에서 chunk 크기와 overlap 전략이 검색 성능에 미치는 영향을 체계적으로 분석한다. 512, 1024, 2048 토큰 크기와 다양한 overlap 비율을 실험하여, 도메인별 최적 설정을 제시한다.",
  "aiCategory": "nlp",
  "devRelevance": 5,
  "relevanceReason": "RAG 파이프라인의 chunk 전략을 실험적으로 비교 분석하여 바로 적용 가능한 가이드라인 제공",
  "devNote": "RAG 시스템 구축 중이라면 chunk 크기 512 vs 1024 비교 결과와 overlap 20% 권장 설정이 바로 참고됨"
}
```

---

## 변경 파일별 상세

### 1. `src/lib/claude/prompts.ts`
- **변경 이유**: 프롬프트에 relevanceReason(5번)과 devNote(6번) 지시 추가
- **Before** (현재 코드):
```typescript
export const SUMMARY_PROMPT = `당신은 AI/ML 논문 요약 전문가입니다.

다음 논문의 초록을 읽고 JSON으로 응답하세요:

1. titleKo: 한글 제목 (학술 용어는 영어 유지)
2. summaryKo: 한글 요약 3~5줄 (일반 개발자가 이해할 수 있는 수준, 핵심 기여와 방법론 포함)
3. aiCategory: 아래 카테고리 중 하나만 선택
   - nlp: 자연어처리, 언어모델, 텍스트
   - cv: 컴퓨터비전, 이미지, 비디오
   - rl: 강화학습
   - multimodal: 멀티모달 (텍스트+이미지 등)
   - agent: AI 에이전트, 도구 사용
   - reasoning: 추론, 사고 체인
   - optimization: 학습 최적화, 효율성
   - safety: AI 안전, 정렬
   - architecture: 모델 아키텍처, 트랜스포머
   - other: 위에 해당 없음
4. devRelevance: LLM을 사용하는 개발자에게 얼마나 유용한지 1~5 점수
   - 5: 직접 적용 가능 (새 프롬프팅 기법, 파인튜닝, RAG, 에이전트 패턴, API 활용)
   - 4: 실무에 참고 (벤치마크, 성능 비교, 아키텍처 개선, 추론 최적화)
   - 3: 알면 좋음 (새 모델 발표, 학습 방법론, 데이터셋)
   - 2: 학술적 (이론 중심, 수학 증명, 특수 도메인)
   - 1: 개발자와 무관 (순수 언어학, 뇌과학, 물리 시뮬레이션)

논문 제목: {title}
초록: {abstract}

JSON만 출력하세요:`;
```
- **After** (변경 후):
```typescript
export const SUMMARY_PROMPT = `당신은 AI/ML 논문 요약 전문가입니다. LLM을 실무에 사용하는 개발자 관점에서 논문을 분석합니다.

다음 논문의 초록을 읽고 JSON으로 응답하세요:

1. titleKo: 한글 제목 (학술 용어는 영어 유지)
2. summaryKo: 한글 요약 3~5줄 (일반 개발자가 이해할 수 있는 수준, 핵심 기여와 방법론 포함)
3. aiCategory: 아래 카테고리 중 하나만 선택
   - nlp: 자연어처리, 언어모델, 텍스트
   - cv: 컴퓨터비전, 이미지, 비디오
   - rl: 강화학습
   - multimodal: 멀티모달 (텍스트+이미지 등)
   - agent: AI 에이전트, 도구 사용
   - reasoning: 추론, 사고 체인
   - optimization: 학습 최적화, 효율성
   - safety: AI 안전, 정렬
   - architecture: 모델 아키텍처, 트랜스포머
   - other: 위에 해당 없음
4. devRelevance: LLM을 사용하는 개발자에게 얼마나 유용한지 1~5 점수
   - 5: 직접 적용 가능 (새 프롬프팅 기법, 파인튜닝, RAG, 에이전트 패턴, API 활용)
   - 4: 실무에 참고 (벤치마크, 성능 비교, 아키텍처 개선, 추론 최적화)
   - 3: 알면 좋음 (새 모델 발표, 학습 방법론, 데이터셋)
   - 2: 학술적 (이론 중심, 수학 증명, 특수 도메인)
   - 1: 개발자와 무관 (순수 언어학, 뇌과학, 물리 시뮬레이션)
5. relevanceReason: devRelevance 점수를 준 이유 한 줄 (왜 이 점수인지 구체적 근거)
6. devNote: 이 논문을 왜 읽어야 하는지 개발자 시점 한 줄 코멘트
   - "~하고 있다면 이 논문의 ~가 참고됨" 형식 권장
   - devRelevance가 1~2인 경우 빈 문자열("")로 응답

논문 제목: {title}
초록: {abstract}

JSON만 출력하세요:`;
```
- **영향 범위**: Claude API 호출 결과에 2개 필드 추가. max_tokens 500이면 충분 (추가 ~50 tokens)

### 2. `src/lib/claude/types.ts`
- **변경 이유**: SummaryResult 타입에 새 필드 반영
- **Before** (현재 코드):
```typescript
export interface SummaryResult {
  titleKo: string;
  summaryKo: string;
  aiCategory: string;
  devRelevance: number;
}
```
- **After** (변경 후):
```typescript
export interface SummaryResult {
  titleKo: string;
  summaryKo: string;
  aiCategory: string;
  devRelevance: number;
  relevanceReason: string;
  devNote: string;
}
```
- **영향 범위**: `client.ts`에서 반환, `summarize.ts`에서 사용

### 3. `src/lib/db/schema.ts`
- **변경 이유**: papers 테이블에 새 컬럼 추가 (nullable text, 마이그레이션 호환)
- **Before** (현재 코드, 17~18행):
```typescript
  devRelevance: integer('dev_relevance').default(3),
  hotScore: integer('hot_score').default(0),
```
- **After** (변경 후):
```typescript
  devRelevance: integer('dev_relevance').default(3),
  relevanceReason: text('relevance_reason'),
  devNote: text('dev_note'),
  hotScore: integer('hot_score').default(0),
```
- **영향 범위**: 기존 데이터에 영향 없음 (nullable, 기존 행은 null). `drizzle-kit push` 시 ALTER TABLE 자동 처리

### 4. `scripts/summarize.ts`
- **변경 이유**: Claude 응답의 새 필드를 DB에 저장
- **Before** (현재 코드, 21~28행):
```typescript
    await db.update(papers)
      .set({
        titleKo: result.titleKo,
        summaryKo: result.summaryKo,
        aiCategory: result.aiCategory,
        devRelevance: result.devRelevance,
        summarizedAt: new Date().toISOString(),
      })
      .where(eq(papers.id, id));
```
- **After** (변경 후):
```typescript
    await db.update(papers)
      .set({
        titleKo: result.titleKo,
        summaryKo: result.summaryKo,
        aiCategory: result.aiCategory,
        devRelevance: result.devRelevance,
        relevanceReason: result.relevanceReason,
        devNote: result.devNote,
        summarizedAt: new Date().toISOString(),
      })
      .where(eq(papers.id, id));
```
- **영향 범위**: 수집 파이프라인. 기존 논문은 재요약 시 새 필드가 채워짐

## 비용 영향
- 추가 output tokens: 논문당 ~50 tokens (relevanceReason ~25 + devNote ~25)
- 월간 추가 비용: ~$0.15 (100편/일 × 30일 × 50 tokens)
- 총 월간: ~$0.60 → ~$0.75

## 검증
- 검증 명령어: `npx tsc --noEmit`
- 기대 결과: 에러 0건
- 추가 확인: `npm run build` 성공
