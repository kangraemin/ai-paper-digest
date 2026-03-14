# Phase 1 / Step 2: page.tsx TimelineFeed

## 변경 파일
- `src/app/page.tsx`
- `src/app/bookmarks/page.tsx`

## 테스트 케이스

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | PaperGrid 제거, TimelineFeed 존재 | PaperGrid 함수 제거, TimelineFeed 함수 존재 | ✅ |
| TC-02 | 날짜 유틸 함수 | formatDateHeader, groupByDate 함수 존재 | ✅ |
| TC-03 | DateNav 제거 | DateNav import 및 사용 제거 | ✅ |
| TC-04 | HotPapers devNote prop | PaperCard에 `devNote={paper.devNote}` 전달 | ✅ |
| TC-05 | sticky 날짜 구분선 | `sticky top-0` + `backdrop-blur` 클래스 사용 | ✅ |
| TC-06 | Home 컴포넌트 구조 | TimelineFeed 렌더링 + 제목 "최근 논문" | ✅ |
| TC-07 | tsc + build 통과 | `npx tsc --noEmit` 에러 0건 | ✅ |

## 실행출력

TC-01: `grep -c PaperGrid src/app/page.tsx` + `grep -c TimelineFeed src/app/page.tsx`
→ PaperGrid: 0건 (제거 완료), TimelineFeed: 2건 (함수 정의 + JSX 사용)

TC-02: `grep -cE 'formatDateHeader|groupByDate' src/app/page.tsx`
→ 4건 (각 함수 정의 + 호출)

TC-03: `grep -c DateNav src/app/page.tsx`
→ 0건 (완전 제거)

TC-04: `grep -c 'devNote={paper.devNote}' src/app/page.tsx`
→ 2건 (TimelineFeed + HotPapers 양쪽 모두 전달)

TC-05: `grep -cE 'sticky top-0|backdrop-blur' src/app/page.tsx`
→ 1건 (sticky 날짜 구분선에 적용)

TC-06: `grep -c '최근 논문' src/app/page.tsx`
→ 1건 (h1 제목)

TC-07: `npx tsc --noEmit`
→ 출력 없음 (에러 0건)
