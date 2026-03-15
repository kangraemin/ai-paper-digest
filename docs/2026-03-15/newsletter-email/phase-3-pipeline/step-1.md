# Step 1: Workflow + Env Update

## 변경 파일
- `.github/workflows/collect.yml`
- `.env.example`

## TC

| ID | 테스트 항목 | 검증 방법 | 기대 결과 | 통과 |
|------|-----------|----------|----------|------|
| TC-1 | send-newsletter 스텝 존재 | collect.yml 확인 | "Summarize with Claude" 다음에 "Send daily newsletter" 스텝 | ✅ |
| TC-2 | 필요 env 변수 포함 | 스텝 env 확인 | TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, RESEND_API_KEY, SITE_URL | ✅ |
| TC-3 | SITE_URL .env.example에 추가 | 파일 확인 | SITE_URL 항목 존재 | ✅ |
| TC-4 | YAML 문법 유효 | 구조 확인 | 들여쓰기, 키-값 구조 정상 | ✅ |

## 실행출력

TC-1: grep 'Send daily newsletter' .github/workflows/collect.yml
→ - name: Send daily newsletter

TC-2: grep -A5 'Send daily newsletter' .github/workflows/collect.yml
→ TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, RESEND_API_KEY, SITE_URL 확인

TC-3: grep 'SITE_URL' .env.example
→ SITE_URL=https://your-site.vercel.app

TC-4: YAML 구조 확인 — 들여쓰기 일관성 (2 spaces), step 구조 정상
