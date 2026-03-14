# Phase 4 - Step 2: 트렌드 분석

## 목표
카테고리별 논문 트렌드를 차트로 시각화한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | 트렌드 페이지 | src/app/trends/page.tsx 존재 | ✅ |
| TC-02 | 트렌드 차트 | src/components/trend-chart.tsx Recharts BarChart | ✅ |
| TC-03 | 트렌드 API | src/app/api/trends/route.ts 카테고리 집계 | ✅ |
| TC-04 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 실행 결과

TC-01~03: 3개 파일 생성
TC-04: `npm run build` → 빌드 성공
