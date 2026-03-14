# 미요약 글 웹 UI 노출 방지

5개 리스트 쿼리에 `isNotNull(papers.summarizedAt)` 필터 추가.

## 변경 파일
- `src/app/page.tsx`: 홈 타임라인
- `src/app/api/papers/route.ts`: 목록 API
- `src/lib/db/queries.ts`: 검색
- `src/app/api/trends/route.ts`: 트렌드
- `src/app/api/rss/route.ts`: RSS
