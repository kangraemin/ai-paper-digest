# Phase 4 - Step 3: 뉴스레터

## 목표
이메일 뉴스레터 구독 기능을 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | 구독 폼 | src/components/newsletter-form.tsx 존재 | ✅ |
| TC-02 | 구독 API | src/app/api/newsletter/route.ts POST 엔드포인트 | ✅ |
| TC-03 | 홈 통합 | page.tsx에 NewsletterForm 포함 | ✅ |
| TC-04 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 실행 결과

TC-01~03: newsletter-form.tsx, newsletter/route.ts 생성 + page.tsx 통합
TC-04: `npm run build` → 빌드 성공 (trends 포함 전체 8 route)
