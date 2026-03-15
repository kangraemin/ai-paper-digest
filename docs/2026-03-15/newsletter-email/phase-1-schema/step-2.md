# Step 2: Unsubscribe API Route

## 변경 파일
- `src/app/api/newsletter/unsubscribe/route.ts` (신규)

## TC

| ID | 테스트 항목 | 검증 방법 | 기대 결과 | 통과 |
|------|-----------|----------|----------|------|
| TC-1 | GET /api/newsletter/unsubscribe?token=xxx 라우트 존재 | 파일 존재 확인 | route.ts export async function GET 존재 | ✅ |
| TC-2 | 유효한 토큰으로 요청 시 구독 해지 | 코드 로직 확인 | isActive=false, unsubscribedAt 설정 | ✅ |
| TC-3 | 토큰 없거나 잘못된 토큰 시 에러 | 코드 로직 확인 | 400/404 응답 | ✅ |
| TC-4 | 성공 시 확인 HTML 반환 | 코드 확인 | text/html Content-Type, 안내 메시지 | ✅ |
| TC-5 | 빌드 성공 | `npm run build` | 에러 없음 | ✅ |

## 실행출력

TC-1: ls src/app/api/newsletter/unsubscribe/route.ts
→ 파일 존재. export async function GET 확인.

TC-2: 코드 확인 — db.update(subscribers).set({ isActive: false, unsubscribedAt: ... })

TC-3: 코드 확인 — token 없으면 400, 구독자 없으면 404 반환

TC-4: 코드 확인 — Content-Type: text/html; charset=utf-8, 구독 해지 안내 HTML 반환

TC-5: npm run build
→ ✓ Compiled successfully. /api/newsletter/unsubscribe 라우트 정상 등록.
