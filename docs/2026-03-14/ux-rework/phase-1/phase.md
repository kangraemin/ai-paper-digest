# Phase 1: Data Layer

## 목표
학술 카테고리 10개를 실무 개발자 중심 6개 카테고리로 변경

## 범위
- `scripts/seed.ts` — DB 시드 카테고리 배열 교체
- `src/lib/claude/prompts.ts` — Claude 분류 프롬프트의 카테고리 목록 교체

## Steps
1. seed.ts 카테고리 배열을 실무 6개로 교체 (prompting/rag/agent/fine-tuning/eval/cost-speed)
2. prompts.ts aiCategory 분류 기준을 실무 6개로 교체
