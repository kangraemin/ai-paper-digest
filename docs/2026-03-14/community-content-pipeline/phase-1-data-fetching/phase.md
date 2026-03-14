# Phase 1: 데이터 수집 기반

## 목표
커뮤니티 콘텐츠(원문 + 댓글)를 수집할 수 있는 기반 모듈 구현

## 범위
- `src/lib/content-fetcher.ts` (신규): URL → 텍스트 변환 범용 모듈
- `src/lib/hacker-news/client.ts` (수정): fetchHNComments 함수 추가

## Steps
1. content-fetcher.ts 구현 + 테스트
2. fetchHNComments 구현 + 테스트
