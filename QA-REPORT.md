# QA Check Report

> 점검일: 2026-03-23
> 프로젝트: ai-paper
> 스택: Next.js 15, TypeScript, Drizzle ORM, Turso, Claude API

## 요약

| 카테고리 | Critical | Important | Minor |
|----------|----------|-----------|-------|
| 코드 로직 | 2 | 3 | 1 |
| 보안 | 0 | 1 | 0 |
| 설정/환경 | 0 | 1 | 1 |
| 의존성 | 0 | 0 | 0 |
| 코드 품질 | 0 | 2 | 1 |
| **합계** | **0** | **7** | **3** |

> ⚠️ .env git 노출은 오탐 — `git ls-files .env` 결과 없음. .gitignore에 정상 등록됨.

---

## Critical 이슈

없음. (기존 C-1, C-2 오탐 확인)
- `client.ts`: JSON.parse 실패 시 summarizePaper가 throw → 호출부 summarize.ts에서 try-catch로 처리하여 다음 논문 계속 진행
- `screener.ts`: JSON.parse 실패 시 108-109번째 줄 fallback `{ pass: false, score: 0 }` 반환

---

## Important 이슈

### [I-1] sendSlackNotification fetch 에러 미처리
- **파일**: `src/lib/slack/notify.ts`, `scripts/summarize.ts:44`
- **문제**: fetch 실패 시 exception 발생 → summarize.ts에서 미처리로 전체 배치 실패
- **수정 제안**: sendSlackNotification 내부 try-catch 추가, 실패해도 false 반환

### [I-2] API date 파라미터 유효성 검증 없음
- **파일**: `src/app/api/papers/route.ts:27-30`
- **문제**: `searchParams.get('date')` 유효성 검증 없이 SQL 조건에 사용
- **수정 제안**:
  ```typescript
  if (date && !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 });
  }
  ```

### [I-3] HN 아이템 개별 fetch 실패 시 전체 배치 실패
- **파일**: `src/lib/hacker-news/client.ts:36-39`
- **문제**: `Promise.all` 사용 — 하나라도 실패하면 전체 실패
- **수정 제안**: `Promise.allSettled`로 교체

### [I-4] PDF fetch 타임아웃 없음
- **파일**: `src/lib/pdf-fetcher.ts`
- **문제**: 대용량 PDF 또는 느린 서버 시 스크립트 hang 위험
- **수정 제안**: 30초 타임아웃 추가

### [I-5] DB 환경변수 누락 시 시작 시점 에러 아닌 쿼리 시점 에러
- **파일**: `src/lib/db/index.ts:12-13`
- **문제**: `process.env.TURSO_DATABASE_URL!` — undefined 시 런타임에서 뒤늦게 실패
- **수정 제안**: 앱 시작 시 환경변수 존재 여부 검증

### [I-6] Promise.allSettled 미사용으로 정규식 기반 JSON greedy match
- **파일**: `src/lib/claude/screener.ts:103`, `src/lib/claude/client.ts:26`
- **문제**: `/\{[\s\S]*\}/` greedy match — Claude가 복수 JSON 반환 시 첫 `{`~마지막 `}` 전체 캡처

### [I-7] bulk-collect.ts의 semantic-scholar 모듈 미존재 (로컬 실행 시 에러)
- **파일**: `scripts/bulk-collect.ts:3`
- **문제**: `../src/lib/semantic-scholar/client` import — 모듈 없음. tsconfig에서 scripts/ 제외해서 빌드는 통과하지만 실제 실행 시 에러
- **수정 제안**: bulk-collect.ts 삭제 or 모듈 구현

---

## Minor 이슈

### [M-1] arxivUrl 필드명 혼동
- **파일**: `scripts/digest-community.ts:34`
- **문제**: HN/Reddit 아이템의 `arxivUrl` 필드가 실제로는 커뮤니티 링크 URL
- **개선**: `originalUrl` 또는 `sourceUrl`로 필드명 변경 고려

### [M-2] send-newsletter.ts 환경변수 미검증
- **파일**: `scripts/send-newsletter.ts:7`
- **문제**: `new Resend(process.env.RESEND_API_KEY)` — undefined 가능성

### [M-3] runner.ts catch 블록에서 에러 숨김
- **파일**: `src/lib/claude/runner.ts:46`
- **문제**: JSON parse 실패를 generic catch로 처리 후 원문 반환 — 에러 숨김

---

## TODO/FIXME 목록

없음.

---

## 점검하지 않은 영역

- 프론트엔드 컴포넌트 (shadcn/ui 기반, 복잡한 상태관리 없음)
- E2E 테스트 내용 (playwright 설정만 확인)
- 접근성(a11y), SEO
