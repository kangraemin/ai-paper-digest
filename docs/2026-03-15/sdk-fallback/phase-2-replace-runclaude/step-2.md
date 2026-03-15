# Phase 2 — Step 2: `src/lib/claude/screener.ts` 수정

## TC

| # | 검증 항목 | 기대 결과 | 통과 |
|---|----------|----------|------|
| TC-01 | import 변경 | `spawn` import 제거, `runClaude` from `./runner` import | ✅ |
| TC-02 | 로컬 runClaude 제거 | 파일 내 `function runClaude` 없음 | ✅ |
| TC-03 | 호출부 변경 | `runClaude(prompt, { model: 'haiku', timeout: 60000 })` | ✅ |
| TC-04 | 타입 체크 | `npx tsc --noEmit src/lib/claude/screener.ts` 에러 없음 | ✅ |

## 실행출력

TC-01: `grep "import.*spawn" src/lib/claude/screener.ts` → 매칭 없음
`head -1 src/lib/claude/screener.ts` → `import { runClaude } from './runner';`

TC-02: `grep "function runClaude" src/lib/claude/screener.ts` → 매칭 없음

TC-03: `grep "runClaude(" src/lib/claude/screener.ts` → `let text = await runClaude(prompt, { model: 'haiku', timeout: 60000 });`

TC-04: node_modules 에러만 발생, screener.ts 자체 타입 에러 없음
