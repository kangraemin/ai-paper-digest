# Phase 2 — Step 1: `src/lib/claude/client.ts` 수정

## TC

| # | 검증 항목 | 기대 결과 | 통과 |
|---|----------|----------|------|
| TC-01 | import 변경 | `spawn`, `tmpdir` import 제거, `runClaude` from `./runner` import | ✅ |
| TC-02 | 로컬 runClaude 제거 | 파일 내 `function runClaude` 없음 | ✅ |
| TC-03 | 호출부 변경 | `runClaude(prompt, { model: 'sonnet', timeout: 120000, jsonOutput: true })` | ✅ |
| TC-04 | 타입 체크 | `npx tsc --noEmit src/lib/claude/client.ts` 에러 없음 | ✅ |

## 실행출력

TC-01: `grep -c "import.*spawn\|import.*tmpdir" src/lib/claude/client.ts` → 0 (제거 확인)
`grep "import.*runClaude.*from.*runner" src/lib/claude/client.ts` → `import { runClaude } from './runner';`

TC-02: `grep "function runClaude" src/lib/claude/client.ts` → 매칭 없음 (제거 확인)

TC-03: `grep "runClaude(" src/lib/claude/client.ts` → `{ model: 'sonnet', timeout: 120000, jsonOutput: true }` 인자 포함 확인

TC-04: `npx tsc --noEmit src/lib/claude/client.ts` → node_modules 에러만 (client.ts 자체 타입 에러 없음)
