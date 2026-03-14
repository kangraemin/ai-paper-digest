# 벌크 논문 수집 스크립트 (bulk-collect)

## Context
현재 DB에 논문 데이터가 부족하다. 2022~2026년 Semantic Scholar 인기 논문과 최근 6개월 HN AI 스토리를 한 번에 수집하는 수동 벌크 스크립트가 필요하다.

## 수집 대상

| 소스 | 범위 | 개수 | 스크리닝 |
|------|------|------|---------|
| S2 2022 | year=2022, citationCount 정렬 | top 30 | ✅ 적용 |
| S2 2023 | year=2023 | top 30 | ✅ 적용 |
| S2 2024 | year=2024 | top 30 | ✅ 적용 |
| S2 2025 | year=2025, 전체 | 최대 500 | ✅ 적용 |
| S2 2026 | year=2026, 전체 | 최대 500 | ✅ 적용 |
| HN | Algolia API, 최근 6개월 | score≥50 | ✅ 적용 |

## 변경 파일별 상세

### 1. `src/lib/semantic-scholar/client.ts`
- **변경 이유**: 연도별/페이지네이션 조회 함수 추가
- **Before**: `fetchPopularPapers(limit=5)` 단일 함수
- **After**: 기존 유지 + `fetchPapersByYear(year, {limit, offset})` + `fetchAllPapersForYear(year, maxPapers?)` 추가

### 2. `src/lib/hacker-news/client.ts`
- **변경 이유**: Algolia API로 과거 6개월 데이터 조회
- **Before**: Firebase API `fetchHNTopAI`, `fetchHNComments`
- **After**: 기존 유지 + `AlgoliaHNHit` 타입 + `fetchHNStoriesAlgolia({daysBack, minScore, maxPages})` 추가

### 3. `scripts/bulk-collect.ts` (신규)
- **용도**: S2 연도별 + HN 벌크 수집
- **CLI**: `--s2-only`, `--hn-only`, `--dry-run`
- **실행**: `npx tsx scripts/bulk-collect.ts`

## 검증
- `npx tsx scripts/bulk-collect.ts --dry-run` → 수집 수량만 출력
- `npx tsx scripts/bulk-collect.ts` → 실제 수집 + DB 저장
