# Verification Round 3 — Plan 대비 최종 확인

## plan.md 대비 변경 파일 매핑

| Plan 항목 | 실제 파일 | 상태 |
|-----------|----------|------|
| 1. schema.ts 수정 (unsubscribeToken) | src/lib/db/schema.ts | ✅ |
| 2. newsletter route.ts 수정 (토큰 생성) | src/app/api/newsletter/route.ts | ✅ |
| 3. email/templates.ts 신규 | src/lib/email/templates.ts | ✅ |
| 4. send-newsletter.ts 신규 | scripts/send-newsletter.ts | ✅ |
| 5. unsubscribe route 신규 | src/app/api/newsletter/unsubscribe/route.ts | ✅ |
| 6. collect.yml 수정 | .github/workflows/collect.yml | ✅ |
| 7. .env.example 수정 | .env.example | ✅ |

## 빌드 검증
- `npm run build`: ✅ Compiled successfully
- 모든 라우트 정상 등록 (/api/newsletter/unsubscribe 포함)

## 커밋 이력
- a9c63e1: feat: subscribers 테이블에 unsubscribeToken 추가 + 구독/재활성화 시 토큰 생성
- f0a585e: feat: 뉴스레터 구독 해지 API 추가
- 3c0c11a: feat: 뉴스레터 일일 다이제스트 이메일 HTML 템플릿 추가
- caf51b3: feat: 뉴스레터 발송 스크립트 추가
- b957a10: feat: 수집 파이프라인에 뉴스레터 발송 스텝 추가

## 결과: PASS
