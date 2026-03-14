# Phase 2: 스크리닝

## 목표
수집 후 DB 저장 전, haiku로 abstract를 읽고 "GPT/Claude API 쓰는 일반 개발자에게 유용한가?" 판별. No이면 저장하지 않음.

## 범위
- `src/lib/claude/screener.ts` (신규) — screenPaper, screenBatch 함수
- `scripts/collect.ts` — 스크리닝 통합
- `.github/workflows/collect.yml` — collect 단계에 ANTHROPIC_API_KEY 추가

## Steps

### Step 1: screener.ts 생성 + collect.ts 통합
- screener.ts: haiku로 abstract 스크리닝 (pass/fail + reason)
- collect.ts: fetch → screenBatch → pass만 DB insert
- collect.yml: ANTHROPIC_API_KEY 추가
