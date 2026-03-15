# Step 2: Send Newsletter Script

## 변경 파일
- `scripts/send-newsletter.ts` (신규)

## TC

| ID | 테스트 항목 | 검증 방법 | 기대 결과 | 통과 |
|------|-----------|----------|----------|------|
| TC-1 | 오늘 summarizedAt 논문 조회 | 코드 확인 | 당일 날짜 필터로 papers 테이블 조회 | ✅ |
| TC-2 | 논문 없으면 skip | 코드 확인 | 조기 종료 + 로그 출력 | ✅ |
| TC-3 | 활성 구독자 조회 | 코드 확인 | isActive=true 필터, 100명 limit | ✅ |
| TC-4 | 기존 구독자 토큰 백필 | 코드 확인 | unsubscribeToken null인 구독자에게 토큰 생성 | ✅ |
| TC-5 | Resend batch.send() 사용 | 코드 확인 | resend.batch.send() 호출 | ✅ |
| TC-6 | renderDailyDigest 템플릿 사용 | import 확인 | templates.ts에서 import | ✅ |
| TC-7 | 빌드 성공 | `npm run build` | 에러 없음 | ✅ |

## 실행출력

TC-1: grep 'summarizedAt' scripts/send-newsletter.ts
→ gte(papers.summarizedAt, todayStart), lt(papers.summarizedAt, tomorrowStart)

TC-2: grep 'return' scripts/send-newsletter.ts
→ "오늘 요약된 논문이 없습니다. 발송을 건너뜁니다." 후 return

TC-3: grep 'isActive' scripts/send-newsletter.ts
→ eq(subscribers.isActive, true), .limit(BATCH_LIMIT) (BATCH_LIMIT=100)

TC-4: grep 'unsubscribeToken' scripts/send-newsletter.ts
→ if (!sub.unsubscribeToken) { token = crypto.randomUUID(); db.update... }

TC-5: grep 'batch.send' scripts/send-newsletter.ts
→ resend.batch.send(emails)

TC-6: grep 'renderDailyDigest' scripts/send-newsletter.ts
→ import { renderDailyDigest } from '../src/lib/email/templates';

TC-7: npm run build
→ ✓ Compiled successfully.
