# 뉴스레터 구독 폼 비활성화

## 변경 파일별 상세

### `src/app/page.tsx`
- **변경 이유**: 도메인 미인증으로 Resend 발송 불가. 유저 유입 후 활성화 예정.
- **Before**:
```tsx
import { NewsletterForm } from "@/components/newsletter-form";
...
<NewsletterForm />
```
- **After**:
```tsx
// import { NewsletterForm } from "@/components/newsletter-form";
...
{/* <NewsletterForm /> */}
```
- **영향 범위**: 메인 페이지 UI만 영향. API/DB 무관.

## 검증
- 검증 명령어: `npx next build`
- 기대 결과: 빌드 성공, 메인 페이지에 구독 폼 미노출
