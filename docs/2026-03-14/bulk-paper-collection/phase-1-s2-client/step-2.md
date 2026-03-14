# Phase 1 - Step 2: fetchAllPapersForYear 함수 구현

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | fetchAllPapersForYear export 존재 | `typeof fetchAllPapersForYear === 'function'` | ✅ |
| TC-02 | maxPapers 기본값 500 | 함수 시그니처에 maxPapers = 500 | ✅ |
| TC-03 | 페이지네이션 반복 | fetchPapersByYear를 offset 증가하며 반복 호출 | ✅ |
| TC-04 | rate limit 대응 | 호출 간 1초 딜레이 포함 | ✅ |

## 실행출력

TC-01: `npx tsx -e "import { fetchAllPapersForYear, fetchPapersByYear, fetchPopularPapers } from './src/lib/semantic-scholar/client'; console.log(typeof fetchAllPapersForYear, typeof fetchPapersByYear, typeof fetchPopularPapers);"`
→ `function function function`

TC-02: `grep -n 'maxPapers = 500' src/lib/semantic-scholar/client.ts`
→ `32:  maxPapers = 500`

TC-03: `grep -n 'fetchPapersByYear' src/lib/semantic-scholar/client.ts`
→ `15:export async function fetchPapersByYear(` / `38:    const batch = await fetchPapersByYear(year, {` (offset 증가하며 반복 호출 확인)

TC-04: `grep -n 'setTimeout' src/lib/semantic-scholar/client.ts`
→ `50:      await new Promise(r => setTimeout(r, 1000));`
