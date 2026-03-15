# Step 1: Schema + Newsletter Route 수정

## 변경 파일
- `src/lib/db/schema.ts`
- `src/app/api/newsletter/route.ts`

## TC

| ID | 테스트 항목 | 검증 방법 | 기대 결과 | 통과 |
|------|-----------|----------|----------|------|
| TC-1 | subscribers 테이블에 unsubscribeToken 컬럼 존재 | schema.ts 코드 확인 | `unsubscribeToken: text('unsubscribe_token').unique()` 존재 | ✅ |
| TC-2 | 신규 구독 시 토큰 생성 | route.ts POST 핸들러 확인 | insert에 `unsubscribeToken: crypto.randomUUID()` 포함 | ✅ |
| TC-3 | 재활성화 시 토큰 없으면 생성 | route.ts 재활성화 분기 확인 | 기존 토큰 없을 때 새 토큰 set | ✅ |
| TC-4 | 빌드 성공 | `npm run build` | 에러 없음 | ✅ |

## 실행출력

TC-1: grep 'unsubscribeToken' src/lib/db/schema.ts
→ unsubscribeToken: text('unsubscribe_token').unique(),

TC-2: grep 'unsubscribeToken' src/app/api/newsletter/route.ts
→ unsubscribeToken: crypto.randomUUID(), (insert 블록)

TC-3: grep 'unsubscribeToken' src/app/api/newsletter/route.ts
→ unsubscribeToken: existing[0].unsubscribeToken || crypto.randomUUID() (update 블록)

TC-4: npm run build
→ ✓ Compiled successfully. Build output normal, no errors.
