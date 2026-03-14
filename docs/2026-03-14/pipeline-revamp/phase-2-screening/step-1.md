# Step 1: screener.ts 생성 + collect.ts 통합

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | screener.ts 존재 | 파일 존재 확인 | screenPaper, screenBatch 함수 export | ✅ |
| TC-02 | haiku 모델 사용 | grep 'haiku' src/lib/claude/screener.ts | claude-haiku-4-5-20251001 | ✅ |
| TC-03 | collect.ts에 스크리닝 통합 | grep 'screen' scripts/collect.ts | screenBatch 호출 + pass만 insert | ✅ |
| TC-04 | collect.yml에 ANTHROPIC_API_KEY 추가 | grep 'ANTHROPIC' .github/workflows/collect.yml | collect 단계에 env 존재 | ✅ |
| TC-05 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `src/lib/claude/screener.ts` 파일 확인
→ `export async function screenPaper(...)` (L15)
→ `export async function screenBatch(...)` (L28)

TC-02: `grep 'haiku' src/lib/claude/screener.ts`
→ L17: `model: 'claude-haiku-4-5-20251001'`

TC-03: `scripts/collect.ts` 스크리닝 통합 확인
→ L5: `import { screenBatch } from '../src/lib/claude/screener';`
→ L13-14: `const screenResults = await screenBatch(...)` 호출
→ L16: `const passed = fetched.filter(p => screenResults.get(p.id)?.pass);` (pass만 필터)
→ L20: `for (const paper of passed)` (pass된 논문만 DB insert)
→ L17: 로그 `[스크리닝] ${fetched.length}편 중 ${passed.length}편 통과`

TC-04: `grep 'ANTHROPIC' .github/workflows/collect.yml`
→ L24: `ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}`
→ L37: `ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY }}`

TC-05: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
