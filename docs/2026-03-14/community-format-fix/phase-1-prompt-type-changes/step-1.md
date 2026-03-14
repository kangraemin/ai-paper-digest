# Phase 1 Step 1: types.ts + prompts.ts 수정

## 변경 대상
- `src/lib/claude/types.ts`
- `src/lib/claude/prompts.ts`

## TC (Test Cases)

### TC-1: types.ts — SummaryResult 타입 필드가 string[]로 변경
- `keyFindings: string[]`
- `evidence: string[]`
- `howToApply: string[]`
- 나머지 필드는 변경 없음

### TC-2: prompts.ts — keyFindings 지시 변경
- "불릿 리스트로 작성" → "JSON 배열로 작성"
- `각 줄은 "- "로 시작` 문구 제거
- 예시가 `\n` 구분 문자열 → JSON 배열 형태
- 규칙 부분의 기존 내용(논문체 금지 등)은 유지

### TC-3: prompts.ts — evidence 지시 변경
- "불릿 리스트로 작성" → "JSON 배열로 작성"
- `각 줄은 "- "로 시작` 문구 제거
- 예시가 JSON 배열 형태
- "줄" → "개" (2~4줄 → 2~4개)

### TC-4: prompts.ts — howToApply 지시 변경
- "불릿 리스트로 작성" → "JSON 배열로 작성"
- `각 줄은 "- "로 시작` 문구 제거
- 예시가 JSON 배열 형태
- "줄" → "개" (2~3줄 → 2~3개)

### TC-5: TypeScript 컴파일 통과
- `npx tsc --noEmit` 에러 없음 (또는 이 변경과 무관한 에러만 존재)

## 완료 기준
- TC-1 ~ TC-5 모두 통과
