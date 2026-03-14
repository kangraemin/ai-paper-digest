# Phase 3 - Step 2: HN Algolia 수집 로직

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | HN 수집 함수 구현 | collectHN()이 fetchHNStoriesAlgolia 호출 | ✅ |
| TC-02 | 스크리닝 통합 | HN 수집 결과에 screenBatch 적용 | ✅ |
| TC-03 | DB 저장 | HN 스토리 DB 저장 로직 동작 | ✅ |

## 실행출력

TC-01: `grep -c 'fetchHNStoriesAlgolia' scripts/bulk-collect.ts`
→ 2 (import 1 + 사용 1)

TC-02: `grep -c 'screenBatch' scripts/bulk-collect.ts`
→ 3 (import 1 + S2 사용 1 + HN 사용 1)

TC-03: `grep -c "source: 'hacker_news'" scripts/bulk-collect.ts`
→ 1
