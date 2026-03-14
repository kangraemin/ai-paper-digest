# Phase 3 - Step 1: 레이아웃 + 홈 페이지

## 목표
사이트 레이아웃, 헤더, 홈 페이지(논문 목록), 카테고리 필터, 날짜 네비를 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | Root Layout | src/app/layout.tsx에 메타데이터, 폰트, 다크모드 설정 | ✅ |
| TC-02 | Header | src/components/header.tsx에 사이트 헤더 + 네비게이션 | ✅ |
| TC-03 | 홈 페이지 | src/app/page.tsx에 오늘의 논문 목록 표시 | ✅ |
| TC-04 | Paper Card | src/components/paper-card.tsx 컴포넌트 | ✅ |
| TC-05 | Category Filter | src/components/category-filter.tsx 카테고리 탭 | ✅ |
| TC-06 | Date Nav | src/components/date-nav.tsx 날짜 네비게이션 | ✅ |
| TC-07 | Hot Badge | src/components/hot-badge.tsx 핫 배지 | ✅ |
| TC-08 | Papers API | src/app/api/papers/route.ts GET 엔드포인트 | ✅ |
| TC-09 | Theme Toggle | src/components/theme-toggle.tsx 다크모드 토글 | ✅ |
| TC-10 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 구현 지시사항
- plan.md의 디렉토리 구조 + API 설계 참조
- shadcn/ui 컴포넌트 활용 (Card, Badge, Tabs, Button)
- next-themes 패키지로 다크모드 구현
- Papers API: date, category, page, limit 파라미터 지원

## 실행 결과

TC-01~09: 9개 파일 생성/수정 + DB lazy init 적용
TC-10: `npm run build` → 빌드 성공
