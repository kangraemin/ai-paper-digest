# Phase 1 — Step 1: `src/lib/claude/anthropic.ts` 생성

## TC

| # | 검증 항목 | 기대 결과 | 통과 |
|---|----------|----------|------|
| 1 | 파일 존재 | `src/lib/claude/anthropic.ts` 존재 | ✅ |
| 2 | export | `callAnthropicSDK` 함수 export | ✅ |
| 3 | MODEL_MAP | sonnet, haiku 매핑 포함 | ✅ |
| 4 | 반환 타입 | `Promise<string>` | ✅ |
| 5 | 타입 체크 | `npx tsc --noEmit src/lib/claude/anthropic.ts` 에러 없음 | ✅ |

## 실행출력

Phase 1 커밋 완료 — 이전 세션에서 검증 및 커밋됨.
