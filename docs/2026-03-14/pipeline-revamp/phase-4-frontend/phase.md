# Phase 4: 프론트엔드

## 목표
새 7항목 구조에 맞게 프론트엔드를 업데이트한다.

## 범위
- `src/components/paper-card.tsx` — oneLiner + targetAudience 표시
- `src/app/papers/[id]/page.tsx` — 7항목 섹션별 렌더링
- `src/app/page.tsx` — props 교체
- `src/app/bookmarks/page.tsx` — props 교체
- `src/app/api/rss/route.ts` — oneLiner 사용
- `src/lib/db/queries.ts` — 검색 대상 확장

## Steps

### Step 1: PaperCard + 메인/북마크 페이지 + RSS + 검색
- paper-card.tsx: summaryKo→oneLiner, devNote→targetAudience
- page.tsx, bookmarks/page.tsx: props 교체
- rss/route.ts: oneLiner 사용
- queries.ts: keyFindings 검색 추가

### Step 2: 상세 페이지 7항목 렌더링
- papers/[id]/page.tsx: 7항목 섹션별 렌더링, 코드블록, 링크 리스트
