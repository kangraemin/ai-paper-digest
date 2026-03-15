# Phase 2: 기존 파일 runClaude 교체

## 목표
3개 파일의 로컬 `runClaude` 함수를 제거하고 `runner.ts`에서 import하도록 교체한다.

## 범위
- `src/lib/claude/client.ts` — summarizePaper에서 사용
- `src/lib/claude/screener.ts` — screenPaper에서 사용
- `scripts/digest-community.ts` — digestCommunity에서 사용

## Steps
1. `src/lib/claude/client.ts` 수정
2. `src/lib/claude/screener.ts` 수정
3. `scripts/digest-community.ts` 수정
