| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | screener 모델 변경 | screener.ts에서 `--model opus` 사용 | ✅ |
| TC-02 | HN client 파일 존재 | `src/lib/hacker-news/client.ts` 생성, fetchHNTopAI export | ✅ |
| TC-03 | collect-hn.ts 파일 존재 | `scripts/collect-hn.ts` 생성, DB insert 로직 포함 | ✅ |
| TC-04 | GitHub Actions 워크플로우 | collect.yml에 HN 수집 step 추가 | ✅ |
| TC-05 | TypeScript 컴파일 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: `grep 'model' src/lib/claude/screener.ts`
→ Line 15: `const proc = spawn('claude', ['-p', '--model', 'opus'], {` ✅

TC-02: `grep 'export async function fetchHNTopAI' src/lib/hacker-news/client.ts`
→ `export async function fetchHNTopAI(limit = 30): Promise<HNItem[]> {` ✅

TC-03: `ls scripts/collect-hn.ts` + `grep 'db.insert' scripts/collect-hn.ts`
→ 파일 존재, DB insert 로직 포함 ✅

TC-04: `grep 'Hacker News' .github/workflows/collect.yml`
→ `- name: Collect AI stories from Hacker News` ✅

TC-05: `npx tsc --noEmit`
→ 출력 없음 (에러 없음) ✅
