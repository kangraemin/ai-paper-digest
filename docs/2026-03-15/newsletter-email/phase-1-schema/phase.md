## 목표
구독 해지를 위한 토큰 기반 인프라 구축

## 범위
- `src/lib/db/schema.ts` — subscribers 테이블에 unsubscribeToken 컬럼 추가
- `src/app/api/newsletter/route.ts` — 구독/재활성화 시 토큰 생성
- `src/app/api/newsletter/unsubscribe/route.ts` — GET 토큰 기반 구독 해지 API

## Steps
1. schema.ts에 unsubscribeToken 추가 + route.ts에서 토큰 생성 로직 추가
2. unsubscribe API route 생성
