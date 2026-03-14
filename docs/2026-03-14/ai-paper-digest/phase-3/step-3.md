# Phase 3 - Step 3: 검색 + RSS Feed

## 목표
검색 기능과 RSS Feed를 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | 검색바 | src/components/search-bar.tsx 디바운스 검색 | ✅ |
| TC-02 | 검색 API | src/app/api/search/route.ts LIKE 검색 | ✅ |
| TC-03 | RSS Feed | src/app/api/rss/route.ts RSS 2.0 XML | ✅ |
| TC-04 | queries.ts | src/lib/db/queries.ts 검색 쿼리 함수 | ✅ |
| TC-05 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 실행 결과

TC-01~04: 4개 파일 생성 (search-bar.tsx, search/route.ts, rss/route.ts, queries.ts)
TC-05: `npm run build` → 빌드 성공 (7개 route 포함)
