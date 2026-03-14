# Phase 1 - Step 1: globals.css 테마 변수 + layout.tsx 다크모드 전용

## 대상 파일
- `src/app/globals.css`
- `src/app/layout.tsx`

## TC (Test Criteria)

| TC | 항목 | 검증 방법 | 상태 |
|----|------|----------|------|
| TC-01 | globals.css에 카테고리 색상 변수 7개 정의 (cat-prompting, cat-rag, cat-agent, cat-finetuning, cat-eval, cat-cost, cat-security) | grep 확인 | ✅ |
| TC-02 | globals.css에 highlight-bg, highlight-border 변수 정의 | grep 확인 | ✅ |
| TC-03 | .dark 배경색이 zinc-950 스케일 (oklch(0.07 ...)) | grep 확인 | ✅ |
| TC-04 | layout.tsx에서 ThemeProvider 제거, html에 className="dark" 고정 | 코드 확인 | ✅ |
| TC-05 | layout.tsx body에 bg-background text-foreground min-h-screen flex flex-col | 코드 확인 | ✅ |
| TC-06 | layout.tsx main에 flex-1 flex flex-col items-center w-full | 코드 확인 | ✅ |
| TC-07 | `npm run build` 성공 | 빌드 실행 | ✅ |

## 실행 결과

TC-01: `grep -c 'color-cat-' src/app/globals.css`
→ 7 (cat-prompting, cat-rag, cat-agent, cat-finetuning, cat-eval, cat-cost, cat-security)

TC-02: `grep 'highlight' src/app/globals.css`
→ --color-highlight-bg: #451a03; / --color-highlight-border: #b45309;

TC-03: `grep 'oklch(0.07' src/app/globals.css`
→ --background: oklch(0.07 0.005 270);    /* zinc-950 */

TC-04: `grep 'ThemeProvider' src/app/layout.tsx` → 0건 (제거됨), `grep 'className="dark"'` → html 태그에 존재

TC-05: `grep 'bg-background text-foreground min-h-screen flex flex-col' src/app/layout.tsx` → body 태그에 존재

TC-06: `grep 'flex-1 flex flex-col items-center w-full' src/app/layout.tsx` → main 태그에 존재

TC-07: `npm run build` → ✓ Compiled successfully, 빌드 성공
