# Phase 2: 저장 로직 + 렌더링 변경

## 목표
저장 스크립트에서 JSON.stringify 적용, 프론트엔드에서 parseBulletList 헬퍼로 배열/문자열 호환 렌더링

## 범위
- `scripts/summarize.ts` — JSON.stringify 추가
- `scripts/digest-community.ts` — JSON.stringify 추가
- `scripts/summarize-local.ts` — JSON.stringify 추가
- `src/app/papers/[id]/page.tsx` — parseBulletList 헬퍼 + 렌더링 변경

## Steps
1. 3개 스크립트 JSON.stringify 적용
2. page.tsx parseBulletList 헬퍼 + 렌더링 수정
