| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | 5개 파일에 isNotNull(summarizedAt) 필터 추가 | grep으로 확인 | ✅ |
| TC-02 | TypeScript 컴파일 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: grep -r "isNotNull(papers.summarizedAt)" src/
→ 6곳 확인 (page.tsx, papers/route.ts, queries.ts, trends/route.ts, rss/route.ts) ✅

TC-02: `npx tsc --noEmit`
→ 에러 없음 (출력 없음) ✅
