# Phase 1 - Step 1: seed.ts 카테고리 교체

## 변경 대상
- `scripts/seed.ts`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | 카테고리 개수 | 정확히 6개 카테고리 존재 | ✅ |
| TC-02 | 카테고리 ID | prompting, rag, agent, fine-tuning, eval, cost-speed | ✅ |
| TC-03 | 각 카테고리 필드 | id, name, nameEn, color, icon 모두 존재 | ✅ |
| TC-04 | TypeScript 문법 | `npx tsc --noEmit scripts/seed.ts` 에러 없음 | ✅ |

## 실행 결과

TC-01: 파일 내 categories 배열 확인
→ 6개 항목: prompting, rag, agent, fine-tuning, eval, cost-speed

TC-02: 카테고리 ID 확인
→ prompting, rag, agent, fine-tuning, eval, cost-speed — 모두 일치

TC-03: 각 항목 필드 확인
→ 6개 모두 { id, name, nameEn, color, icon } 5개 필드 존재

TC-04: `npx tsc --noEmit scripts/seed.ts`
→ seed.ts에서 0건 에러 (node_modules/drizzle-orm 라이브러리 타입 에러만 존재, 프로젝트 코드 무관)
