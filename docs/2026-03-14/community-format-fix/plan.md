# 커뮤니티 글 양식 깨짐 수정

## 변경 파일별 상세

### `src/lib/claude/types.ts`
- **변경 이유**: 타입을 string → string[]로 변경
- **Before**:
```ts
keyFindings: string;
evidence: string;
howToApply: string;
```
- **After**:
```ts
keyFindings: string[];
evidence: string[];
howToApply: string[];
```

### `src/lib/claude/prompts.ts`
- **변경 이유**: AI에게 배열로 반환하도록 지시
- **Before**: 불릿 리스트 문자열 형식 (`"- 항목1\n- 항목2"`)
- **After**: JSON 배열 형식 (`["항목1", "항목2"]`)
- keyFindings, evidence, howToApply 모두 변경

### `src/lib/claude/community-prompts.ts`
- **변경 이유**: 커뮤니티 프롬프트도 동일하게 배열로 변경

### `scripts/summarize.ts`
- **변경 이유**: 배열을 JSON.stringify로 저장
- **Before**: `keyFindings: result.keyFindings,`
- **After**: `keyFindings: JSON.stringify(result.keyFindings),`

### `scripts/digest-community.ts`
- **변경 이유**: 동일하게 JSON.stringify 적용

### `scripts/summarize-local.ts`
- **변경 이유**: 동일하게 JSON.stringify 적용

### `src/app/papers/[id]/page.tsx`
- **변경 이유**: JSON.parse로 배열 파싱 + 기존 문자열 fallback
- **Before**: `paper.keyFindings.split('\n')`
- **After**: `parseBulletList(paper.keyFindings)` 헬퍼 사용

## 검증
- `npm run build` — 빌드 성공 확인
- parseBulletList가 배열/문자열 모두 처리하는지 확인
