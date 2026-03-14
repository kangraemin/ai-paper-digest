# Phase 3 - Step 2: 논문 상세 + 북마크

## 목표
논문 상세 페이지, 북마크 기능, 북마크 목록 페이지를 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | 상세 페이지 | src/app/papers/[id]/page.tsx 존재 | ✅ |
| TC-02 | 상세 API | src/app/api/papers/[id]/route.ts GET 엔드포인트 | ✅ |
| TC-03 | 북마크 버튼 | src/components/bookmark-button.tsx 컴포넌트 | ✅ |
| TC-04 | 북마크 훅 | src/hooks/use-bookmarks.ts localStorage CRUD | ✅ |
| TC-05 | 북마크 목록 | src/app/bookmarks/page.tsx 페이지 | ✅ |
| TC-06 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 구현 지시사항
- localStorage 기반 북마크 (서버 불필요)
- 상세 페이지: 제목, 요약, 초록, 저자, 카테고리, arXiv/PDF 링크

## 실행 결과

TC-01: `ls src/app/papers/\[id\]/page.tsx` → 존재
TC-02: `ls src/app/api/papers/\[id\]/route.ts` → 존재
TC-03: `ls src/components/bookmark-button.tsx` → 존재
TC-04: `ls src/hooks/use-bookmarks.ts` → 존재 (localStorage toggle/isBookmarked)
TC-05: `ls src/app/bookmarks/page.tsx` → 존재
TC-06: `npm run build` → 빌드 성공 (5개 페이지 + 2개 API route)
