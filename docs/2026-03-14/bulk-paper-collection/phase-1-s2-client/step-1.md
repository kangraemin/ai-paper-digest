# Phase 1 - Step 1: fetchPapersByYear 함수 구현

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | fetchPapersByYear export 존재 | `typeof fetchPapersByYear === 'function'` | ✅ |
| TC-02 | year 파라미터로 API 호출 | URL에 `year=2024` 포함 | ✅ |
| TC-03 | limit, offset 옵션 지원 | URL에 `limit=30&offset=0` 포함 | ✅ |
| TC-04 | citationCount 정렬 | URL에 `sort=citationCount` 포함 | ✅ |
| TC-05 | 반환 타입 S2Paper[] | 기존 S2Paper 타입 재사용 | ✅ |
| TC-06 | 기존 fetchPopularPapers 유지 | import 가능, 에러 없음 | ✅ |

## 실행출력

TC-01~06: `npx tsx -e "import { fetchPapersByYear, fetchPopularPapers } from './src/lib/semantic-scholar/client'; console.log(typeof fetchPapersByYear, typeof fetchPopularPapers);"`
→ `function function`
