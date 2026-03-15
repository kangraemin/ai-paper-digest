# Phase 2 — Step 3: `scripts/digest-community.ts` 수정

## TC

| # | 검증 항목 | 기대 결과 | 통과 |
|---|----------|----------|------|
| TC-01 | import 변경 | `spawn` import 제거, `runClaude` from `../src/lib/claude/runner` import | ✅ |
| TC-02 | 로컬 runClaude 제거 | 파일 내 `function runClaude` 없음 | ✅ |
| TC-03 | 호출부 변경 | `runClaude(prompt, { model: 'sonnet', timeout: 120000 })` | ✅ |
| TC-04 | 타입 체크 | `npx tsc --noEmit scripts/digest-community.ts` 에러 없음 | ✅ |

## 실행출력

TC-01: `grep "import.*spawn" scripts/digest-community.ts` → 매칭 없음
`grep "runClaude.*runner" scripts/digest-community.ts` → `import { runClaude } from '../src/lib/claude/runner';`

TC-02: `grep "function runClaude" scripts/digest-community.ts` → 매칭 없음

TC-03: `grep "runClaude(" scripts/digest-community.ts` → `const raw = await runClaude(prompt, { model: 'sonnet', timeout: 120000 });`

TC-04: node_modules 에러만 발생, digest-community.ts 자체 타입 에러 없음
