# Phase 1: types-and-api

## 목표
공유 타입 `PaperListItem` 생성, API 라우트에 source 파라미터·컬럼 프로젝션·Cache-Control 추가

## 범위
- `src/lib/types.ts` (신규)
- `src/app/api/papers/route.ts` (수정)
- `src/app/api/trends/route.ts` (수정)

## Steps
1. `src/lib/types.ts` 생성 — PaperListItem 타입 정의
2. `/api/papers` 라우트 수정 — source 파라미터, 컬럼 프로젝션, hasMore, Cache-Control
3. `/api/trends` 라우트 수정 — Cache-Control 헤더 추가
