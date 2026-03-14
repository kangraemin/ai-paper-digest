# Phase 1: 프롬프트 + 타입 변경

## 목표
AI 프롬프트에서 keyFindings/evidence/howToApply를 배열로 요청하고, 타입 정의를 string[]로 변경

## 범위
- `src/lib/claude/types.ts` — 타입 변경
- `src/lib/claude/prompts.ts` — arxiv 프롬프트 배열 지시
- `src/lib/claude/community-prompts.ts` — 커뮤니티 프롬프트 배열 지시

## Steps
1. types.ts + prompts.ts 수정
2. community-prompts.ts 수정
