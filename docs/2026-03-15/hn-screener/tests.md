| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | HN_SCREEN_PROMPT 존재 | grep으로 확인 | ✅ |
| TC-02 | PAPER_SCREEN_PROMPT 존재 (기존 이름 변경) | grep으로 확인 | ✅ |
| TC-03 | screenPaper에 source 파라미터 | grep으로 확인 | ✅ |
| TC-04 | bulk-collect.ts에서 'hn' 전달 | grep으로 확인 | ✅ |
| TC-05 | collect-hn.ts에서 'hn' 전달 | grep으로 확인 | ✅ |
| TC-06 | TypeScript 컴파일 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: grep "HN_SCREEN_PROMPT" src/lib/claude/screener.ts
→ line 13, 56 확인 ✅

TC-02: grep "PAPER_SCREEN_PROMPT" src/lib/claude/screener.ts
→ line 3, 56 확인 ✅

TC-03: grep "source: 'paper' | 'hn'" src/lib/claude/screener.ts
→ line 55 (screenPaper), line 77 (screenBatch) 확인 ✅

TC-04: grep "'hn'" scripts/bulk-collect.ts
→ line 106 확인 ✅

TC-05: grep "'hn'" scripts/collect-hn.ts
→ line 17 확인 ✅

TC-06: npx tsc --noEmit
→ 에러 없음 ✅
