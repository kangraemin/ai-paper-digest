# Phase 2: AI 정리 파이프라인

## 목표
수집된 원문+댓글을 claude -p로 정리하여 DB에 저장하는 파이프라인 구현

## 범위
- `src/lib/claude/community-prompts.ts` (신규): 커뮤니티 콘텐츠 정리 프롬프트
- `scripts/digest-community.ts` (신규): 파이프라인 스크립트

## Steps
1. community-prompts.ts 구현
2. digest-community.ts 구현 + 테스트
