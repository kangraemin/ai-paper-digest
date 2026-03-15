# Phase 1 — Step 2: `src/lib/claude/runner.ts` 생성

## TC

| # | 검증 항목 | 기대 결과 | 통과 |
|---|----------|----------|------|
| 1 | 파일 존재 | `src/lib/claude/runner.ts` 존재 | ✅ |
| 2 | export | `runClaude` 함수 export | ✅ |
| 3 | env 분기 | `ANTHROPIC_API_KEY` 있으면 SDK, 없으면 CLI | ✅ |
| 4 | RunClaudeOptions | model, timeout, jsonOutput 필드 포함 | ✅ |
| 5 | CLI 모드 | spawn + stdin/stdout 처리, cwd=tmpdir | ✅ |
| 6 | 타입 체크 | `npx tsc --noEmit src/lib/claude/runner.ts` 에러 없음 | ✅ |

## 실행출력

Phase 1 커밋 완료 — 이전 세션에서 검증 및 커밋됨.
