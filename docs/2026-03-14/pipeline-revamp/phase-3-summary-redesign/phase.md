# Phase 3: 요약 양식 재설계

## 목표
요약 결과를 7가지 구조화된 항목으로 재설계하여 개발자가 바로 행동할 수 있는 수준의 요약을 제공한다.

## 범위
- `src/lib/claude/types.ts` — SummaryResult 7항목 구조 변경
- `src/lib/db/schema.ts` — DB 7개 신규 컬럼 추가
- `src/lib/claude/prompts.ts` — 프롬프트 전면 재작성
- `src/lib/claude/client.ts` — max_tokens 500→2000
- `scripts/summarize.ts` — 새 필드 저장
- `scripts/summarize-local.ts` — 새 필드 저장
- `scripts/summarize-claude.sh` — 새 필드 검증

## Steps

### Step 1: 타입 + DB 스키마 변경
- types.ts: SummaryResult를 7항목 구조로 변경
- schema.ts: 7개 신규 컬럼 추가 (nullable)

### Step 2: 프롬프트 + 클라이언트 변경
- prompts.ts: 7가지 항목 프롬프트로 전면 재작성
- client.ts: max_tokens 2000

### Step 3: 스크립트 업데이트
- summarize.ts, summarize-local.ts, summarize-claude.sh: 새 필드 저장/검증
