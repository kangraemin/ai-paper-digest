# Phase 2 - Step 2: fetchHNStoriesAlgolia 함수 구현

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | fetchHNStoriesAlgolia export 존재 | `typeof fetchHNStoriesAlgolia === 'function'` | ✅ |
| TC-02 | Algolia API URL 사용 | 코드에 `hn.algolia.com/api/v1/search` 포함 | ✅ |
| TC-03 | daysBack 파라미터 | 기본값 180, timestamp 계산 | ✅ |
| TC-04 | AI_KEYWORDS 필터링 | 기존 키워드 재사용하여 title 필터링 | ✅ |
| TC-05 | 기존 fetchHNTopAI 유지 | import 가능 | ✅ |

## 실행출력

TC-01, TC-05: `npx tsx -e "import { fetchHNStoriesAlgolia, fetchHNTopAI } from './src/lib/hacker-news/client'; console.log(typeof fetchHNStoriesAlgolia, typeof fetchHNTopAI);"`
→ `function function`

TC-02: `grep -n 'hn.algolia.com' src/lib/hacker-news/client.ts`
→ `75:    const url = \`https://hn.algolia.com/api/v1/search?tags=story&numericFilters=created_at_i>${since},points>${minScore}&hitsPerPage=100&page=${page}\`;`

TC-03: `grep -n 'daysBack.*180' src/lib/hacker-news/client.ts`
→ `67:  const daysBack = opts?.daysBack ?? 180;`

TC-04: `grep -n 'AI_KEYWORDS.some' src/lib/hacker-news/client.ts`
→ `84:      AI_KEYWORDS.some(kw => hit.title.toLowerCase().includes(kw.toLowerCase()))`
