# Phase 1: SDK 래퍼 + 통합 runner 생성

## 목표
Anthropic SDK 래퍼와 환경 분기 통합 runner를 신규 생성한다.

## 범위
- `src/lib/claude/anthropic.ts` — SDK 래퍼
- `src/lib/claude/runner.ts` — 통합 runClaude (env 분기 + CLI 로직)

## Steps
1. `src/lib/claude/anthropic.ts` 생성 — Anthropic SDK 래퍼
2. `src/lib/claude/runner.ts` 생성 — 통합 runner (env 분기)
