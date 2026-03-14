# Phase 5: 기존 DB 데이터 정리

## 목표
기존 DB에 있는 논문을 haiku 스크리닝으로 재검수하여 개발자 무관 논문 삭제.

## 범위
- `scripts/cleanup-papers.ts` (신규) — 기존 논문 스크리닝 + 삭제

## Steps

### Step 1: cleanup-papers.ts 생성
- DB에서 모든 논문 조회
- screenBatch로 스크리닝
- pass: false인 논문 DELETE
- 유지/삭제 편수 로그 출력
