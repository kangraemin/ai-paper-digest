# 뉴스레터 이메일 발송 기능

## Context
구독 폼은 있지만 실제 이메일 발송이 없음. Resend 패키지와 API 키는 이미 설정됨.
수집 파이프라인 끝에 발송 스텝을 추가하여 구독자에게 일일 논문 다이제스트를 보냄.

## 변경 파일별 상세

### 1. `src/lib/db/schema.ts` (수정)
- **변경 이유**: unsubscribe 링크용 토큰 컬럼 추가
- **Before**:
```ts
export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  subscribedAt: text('subscribed_at').notNull(),
  unsubscribedAt: text('unsubscribed_at'),
});
```
- **After**:
```ts
export const subscribers = sqliteTable('subscribers', {
  id: text('id').primaryKey(),
  email: text('email').unique().notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  subscribedAt: text('subscribed_at').notNull(),
  unsubscribedAt: text('unsubscribed_at'),
  unsubscribeToken: text('unsubscribe_token').unique(),
});
```

### 2. `src/app/api/newsletter/route.ts` (수정)
- **변경 이유**: 구독/재활성화 시 unsubscribeToken 생성
- **Before**: id만 생성
- **After**: 신규 구독 시 `unsubscribeToken: crypto.randomUUID()`, 재활성화 시 토큰 없으면 생성

### 3. `src/lib/email/templates.ts` (신규)
- **용도**: 일일 다이제스트 HTML 이메일 템플릿
- `renderDailyDigest(data)` — 테이블 기반 600px, 인라인 CSS, 모바일 호환
- 섹션: 헤더(날짜), 핫 논문(5편), 개발자 추천(5편), 카테고리 요약, 푸터(unsubscribe)

### 4. `scripts/send-newsletter.ts` (신규)
- **용도**: 당일 요약 논문을 구독자에게 Resend batch 발송
- 오늘 summarizedAt 논문 조회 → 없으면 skip
- 활성 구독자 100명까지 Resend batch.send()
- 기존 구독자 토큰 백필

### 5. `src/app/api/newsletter/unsubscribe/route.ts` (신규)
- **용도**: GET 토큰 기반 구독 해지
- token → 구독자 조회 → isActive=false → 확인 HTML

### 6. `.github/workflows/collect.yml` (수정)
- summarize 다음에 send-newsletter 스텝 추가

### 7. `.env.example` (수정)
- `SITE_URL` 추가

## 검증
- `npx drizzle-kit push` — 스키마 마이그레이션
- `npm run build` — 빌드 성공
- `npx tsx scripts/send-newsletter.ts` — 로컬 테스트
- `/api/newsletter/unsubscribe?token=xxx` — 구독 해지 확인
