# Phase 4 - Step 1: page.tsx 페이지 어셈블리

## 변경 대상
- `src/app/page.tsx`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | HotPapers 제거 | HotPapers 컴포넌트/함수 및 Suspense 래퍼 제거 | ✅ |
| TC-02 | CategoryFilter 제거 | CategoryFilter import/렌더링 제거 | ✅ |
| TC-03 | devRelevance 정렬 | 날짜 그룹 내 devRelevance 내림차순 정렬 | ✅ |
| TC-04 | 빈 상태 디자인 | ¯\_(ツ)_/¯ + "오늘은 조용한 날" 메시지 | ✅ |
| TC-05 | 제목 간소화 | "최근 논문" h1 제거 또는 간소화 | ✅ |
| TC-06 | 빌드 에러 | TypeScript 에러 없음 | ✅ |

## 실행출력

TC-01: HotPapers 함수 완전 제거, Suspense 래퍼 제거 확인
TC-02: CategoryFilter import 및 렌더링 제거 확인
TC-03: `grouped[date].sort((a, b) => (b.devRelevance ?? 0) - (a.devRelevance ?? 0))` 추가 확인
TC-04: `¯\_(ツ)_/¯` + "오늘은 조용한 날이네요." 빈 상태 확인
TC-05: "최근 논문" h1 제거됨, 단일 TimelineFeed + NewsletterForm 구조
TC-06: TypeScript 문법 정상
