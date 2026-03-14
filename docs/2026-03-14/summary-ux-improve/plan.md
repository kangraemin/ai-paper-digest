# 요약 UX 개선: 용어 사전 + 태그 세분화 + 관련도 기준

## Context
현재 요약이 ML 엔지니어 수준으로 작성되어 일반 개발자(GPT/Claude API 사용자)가 이해하기 어려움. 3가지 개선 필요:
1. 용어 사전 섹션 추가 — 모를 만한 용어를 초보자 수준으로 풀어 설명
2. 태그 세분화 — 카테고리 6개만으로 부족, 세부 태그 여러 개 추가
3. 관련도 기준 명확화 — 1~5 점수의 구체적 기준 제시

## 변경 파일

### 1. `src/lib/claude/types.ts`
- **Before**:
```typescript
export interface SummaryResult {
  titleKo: string;
  oneLiner: string;
  targetAudience: string;
  keyFindings: string;
  evidence: string;
  howToApply: string;
  codeExample: string;
  relatedResources: string[];
  aiCategory: string;
  devRelevance: number;
}
```
- **After**:
```typescript
export interface SummaryResult {
  titleKo: string;
  oneLiner: string;
  targetAudience: string;
  keyFindings: string;
  evidence: string;
  howToApply: string;
  codeExample: string;
  relatedResources: string[];
  glossary: Record<string, string>;  // 용어 사전 {용어: 설명}
  tags: string[];                     // 세부 태그 배열
  aiCategory: string;
  devRelevance: number;
}
```

### 2. `src/lib/db/schema.ts`
- 신규 컬럼 2개 추가 (nullable text, JSON):
```typescript
  glossary: text('glossary'),         // JSON: {"SFT": "정답 데이터로 학습시키는 방식", ...}
  tags: text('tags'),                 // JSON: ["프롬프트엔지니어링", "RAG", "청킹"]
```
- `relatedResources` 아래, `hotScore` 위에 추가

### 3. `src/lib/claude/prompts.ts`
프롬프트에 3가지 추가/수정:

**용어 사전 (glossary)** 추가:
```
8. glossary: 이 요약에서 나온 어려운 용어를 초보자도 이해할 수 있게 설명하는 객체.
   - 키: 용어 (영어 약자면 영어 그대로)
   - 값: 비유나 일상 표현으로 풀어쓴 설명 (1~2문장)
   - 예: {"SFT": "모범답안을 보여주고 따라하게 하는 학습법. 학교에서 예제 풀이 보고 따라 푸는 것과 비슷.", "LoRA": "모델 전체를 다 바꾸지 않고 작은 어댑터만 끼워서 학습하는 기법. 안경 쓰면 시력이 바뀌듯이, 어댑터만 끼우면 모델 능력이 바뀜."}
   - 최소 3개, 최대 8개
```

**태그 (tags)** 추가:
```
9. tags: 이 논문과 관련된 세부 태그 배열. 한글로 작성.
   사용 가능한 태그 목록:
   "프롬프트엔지니어링", "RAG", "청킹", "임베딩", "벡터검색",
   "에이전트", "MCP", "함수호출", "도구사용",
   "파인튜닝", "LoRA", "RLHF",
   "추론최적화", "양자화", "캐싱",
   "평가", "벤치마크", "레드팀",
   "보안", "프롬프트인젝션", "프라이버시",
   "코드생성", "멀티모달"
   1~4개 선택.
```

**관련도 기준 (devRelevance)** 명확화:
```
11. devRelevance: 1~5 점수 (아래 기준 엄격 적용)
   - 5: 지금 바로 코드에 적용 가능 (프롬프트 기법, RAG 청크 전략, 에이전트 패턴)
   - 4: 설정/아키텍처 변경으로 적용 (보안 패턴, 캐싱 전략, 평가 파이프라인)
   - 3: 알아두면 의사결정에 도움 (모델 벤치마크, 비용 비교)
   - 2: 배경지식으로 유용 (학습 방법론, 새 모델 발표)
   - 1: 읽을 필요 없음 (순수 이론)
```

### 4. `scripts/summarize.ts`
- DB update에 `glossary: JSON.stringify(result.glossary)`, `tags: JSON.stringify(result.tags)` 추가

### 5. `scripts/summarize-local.ts`
- update 함수 타입에 `glossary`, `tags` 추가
- DB set에 `glossary: JSON.stringify(r.glossary)`, `tags: JSON.stringify(r.tags)` 추가

### 6. `scripts/summarize-claude.sh`
- Python 내 JSON에 `glossary`, `tags` 필드 포함하여 DB 전달

### 7. `src/app/papers/[id]/page.tsx`
- 용어 사전 섹션 추가: `glossary`를 JSON.parse → 용어/설명 리스트로 렌더링
- 태그 표시: `tags`를 JSON.parse → Badge 컴포넌트로 렌더링 (카테고리 뱃지 옆)
- 관련도 뱃지에 텍스트 추가: "관련도: 5/5 (바로 적용)"

### 8. `src/components/paper-card.tsx`
- props에 `tags: string | null` 추가
- 카드에 태그 뱃지 표시 (최대 3개)

### 9. `src/app/page.tsx` + `src/app/bookmarks/page.tsx`
- PaperCard에 `tags` prop 전달

## 검증
1. `npx tsc --noEmit` — 에러 0
2. `npx drizzle-kit push` — glossary, tags 컬럼 추가
3. 1편 opus 요약 → glossary, tags 필드 채워지는지 확인
4. `npm run build` — 빌드 성공
5. 상세 페이지에서 용어 사전 + 태그 렌더링 확인
