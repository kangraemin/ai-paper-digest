# Phase 1 Step 2: community-prompts.ts 수정

## 변경 대상
- `src/lib/claude/community-prompts.ts`

## TC (Test Cases)

### TC-1: keyFindings 지시 변경
- "불릿 리스트로 작성" → "JSON 배열로 작성"
- `각 줄은 "- "로 시작` 문구 제거
- "줄" → "개" (3~5줄 → 3~5개)

### TC-2: evidence 지시 변경
- "불릿 리스트로 작성" → "JSON 배열로 작성"
- `각 줄은 "- "로 시작` 문구 제거
- "줄" → "개" (2~4줄 → 2~4개)

### TC-3: howToApply 지시 변경
- "불릿 리스트" → "JSON 배열"
- `각 줄은 "- "로 시작` 문구 제거 (있다면)

### TC-4: 나머지 필드 변경 없음
- 다른 필드(titleKo, oneLiner, targetAudience 등)는 그대로

### TC-5: TypeScript 컴파일 통과

## 완료 기준
- TC-1 ~ TC-5 모두 통과
