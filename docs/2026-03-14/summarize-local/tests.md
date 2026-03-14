| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | --dump --limit 3 실행 | JSON 배열 출력, 3개 항목, id/title/abstract 필드 존재 | ✅ |
| TC-02 | --update file.json 실행 | DB에 요약 데이터 저장, "Updated N papers" 출력 | ✅ |
| TC-03 | 인자 없이 실행 | Usage 메시지 출력 | ✅ |
| TC-04 | tsc --noEmit | 타입 에러 없음 | ✅ |

## 실행출력

TC-01: `npx tsx scripts/summarize-local.ts --dump --limit 3`
→ JSON 배열 3개 항목 출력, id/title/abstract 필드 존재. stderr: "3 papers dumped"

TC-02: `npx tsx scripts/summarize-local.ts --update /tmp/test-summary.json`
→ "Updated 1 papers" 출력

TC-03: `npx tsx scripts/summarize-local.ts`
→ "Usage: --dump [--limit N] | --update <file.json>" 출력

TC-04: `npx tsc --noEmit`
→ 에러 없음 (출력 없음)
