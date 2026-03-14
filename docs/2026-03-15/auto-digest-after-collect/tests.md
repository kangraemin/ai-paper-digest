| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | digestCommunity export 확인 | grep으로 확인 | ✅ |
| TC-02 | bulk-collect.ts에 자동 요약 루프 | grep으로 확인 | ✅ |
| TC-03 | TypeScript 컴파일 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: grep "export async function digestCommunity" scripts/digest-community.ts
→ line 39 확인 ✅

TC-02: grep "digestCommunity" scripts/bulk-collect.ts
→ line 155 import, line 160 호출 확인 ✅

TC-03: `npx tsc --noEmit`
→ 에러 없음 ✅
