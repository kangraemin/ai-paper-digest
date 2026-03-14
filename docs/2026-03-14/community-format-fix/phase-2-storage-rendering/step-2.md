# Phase 2 Step 2: page.tsx parseBulletList 헬퍼 + 렌더링 수정

## 변경 대상
- `src/app/papers/[id]/page.tsx`

## TC (Test Cases)

### TC-1: parseBulletList 헬퍼 함수 추가
- 파일 상단(컴포넌트 밖)에 `parseBulletList(value: string): string[]` 함수 존재
- JSON 배열이면 파싱하여 반환
- 구 형식(`\n` 구분 불릿 리스트)이면 fallback으로 split 처리

### TC-2: keyFindings 렌더링 (line 128)
- `.split('\n').filter(l => l.trim()).map(...)` → `parseBulletList(paper.keyFindings).map(...)`
- `.replace(/^-\s*/, '')` 제거 (헬퍼가 처리)

### TC-3: evidence 렌더링 (line 144)
- 동일 패턴 교체

### TC-4: howToApply 렌더링 (line 160)
- 동일 패턴 교체

### TC-5: TypeScript 컴파일 통과

## 구현 내용
- `parseBulletList(value: string): string[]` 헬퍼 함수를 파일 상단(import 아래, categoryColorMap 위)에 추가
- keyFindings, evidence, howToApply 3곳의 `.split('\n').filter(...).map(...)` 패턴을 `parseBulletList()` 호출로 교체
- `.replace(/^-\s*/, '')` 제거 (헬퍼가 처리)

## 변경 파일
- `src/app/papers/[id]/page.tsx`

## 빌드
- `npx tsc --noEmit` → ✅ 성공 (에러 없음)

## 실행출력

TC-1: `grep -n 'parseBulletList' src/app/papers/[id]/page.tsx`로 함수 존재 확인
→ parseBulletList 헬퍼 함수가 line 10에 추가됨. JSON 배열이면 파싱, 아니면 fallback split 처리. ✅

TC-2: keyFindings 렌더링 확인
→ `parseBulletList(paper.keyFindings).map(...)` 으로 교체됨, `.replace()` 제거됨. ✅

TC-3: evidence 렌더링 확인
→ `parseBulletList(paper.evidence).map(...)` 으로 교체됨, `.replace()` 제거됨. ✅

TC-4: howToApply 렌더링 확인
→ `parseBulletList(paper.howToApply).map(...)` 으로 교체됨, `.replace()` 제거됨. ✅

TC-5: `npx tsc --noEmit`
→ 에러 없이 통과. ✅

## 완료 기준
- TC-1 ~ TC-5 모두 ✅ 통과
