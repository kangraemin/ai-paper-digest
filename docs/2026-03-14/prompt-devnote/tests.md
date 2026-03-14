| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | prompts.ts에 relevanceReason 지시 포함 | "relevanceReason" 문자열 존재 | ✅ |
| TC-02 | prompts.ts에 devNote 지시 포함 | "devNote" 문자열 존재 | ✅ |
| TC-03 | types.ts에 relevanceReason, devNote 필드 | SummaryResult에 2개 필드 추가 | ✅ |
| TC-04 | schema.ts에 relevanceReason, devNote 컬럼 | papers 테이블에 2개 컬럼 추가 | ✅ |
| TC-05 | summarize.ts에 새 필드 DB 저장 | relevanceReason, devNote set에 포함 | ✅ |
| TC-06 | npx tsc --noEmit 통과 | 에러 0건 | ✅ |

## 실행출력

TC-01: grep "relevanceReason" src/lib/claude/prompts.ts
→ 5. relevanceReason: devRelevance 점수를 준 이유 한 줄

TC-02: grep "devNote" src/lib/claude/prompts.ts
→ 6. devNote: 이 논문을 왜 읽어야 하는지 개발자 시점 한 줄 코멘트

TC-03: grep -c "relevanceReason\|devNote" src/lib/claude/types.ts
→ 2 (두 필드 모두 존재)

TC-04: grep -c "relevance_reason\|dev_note" src/lib/db/schema.ts
→ 2 (두 컬럼 모두 존재)

TC-05: grep -c "relevanceReason\|devNote" scripts/summarize.ts
→ 2 (두 필드 모두 DB set에 포함)

TC-06: npx tsc --noEmit
→ 에러 0건 (출력 없음 = 성공)
