# Phase 4: Advanced (고급 기능)

## 목표
핫 논문 하이라이트, 트렌드 분석 차트, 뉴스레터 구독 기능을 구현한다.

## 범위
- 홈 상단 핫 논문 섹션
- 트렌드 페이지 + Recharts 차트
- 뉴스레터 구독 폼 + API

## Steps

### Step 1: 핫 논문 하이라이트
- 홈 상단에 핫 논문 섹션 추가
- 핫 필터 탭 추가
- 검증: npm run build 성공

### Step 2: 트렌드 분석
- src/app/trends/page.tsx
- src/components/trend-chart.tsx (Recharts)
- src/app/api/trends/route.ts
- 검증: npm run build 성공

### Step 3: 뉴스레터
- src/components/newsletter-form.tsx
- src/app/api/newsletter/route.ts
- 검증: npm run build 성공
