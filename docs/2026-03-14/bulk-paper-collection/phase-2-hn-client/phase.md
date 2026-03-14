# Phase 2: HN Client 확장

## 목표
Hacker News client에 Algolia API 기반 과거 스토리 조회 함수 추가

## 범위
- `src/lib/hacker-news/client.ts`에 `AlgoliaHNHit` 타입 + `fetchHNStoriesAlgolia` 함수 추가
- 기존 `fetchHNTopAI`, `fetchHNComments` 유지
- `AI_KEYWORDS` 재사용

## Steps

### Step 1: AlgoliaHNHit 타입 정의
- Algolia HN API 응답 구조에 맞는 타입 정의
- `objectID`, `title`, `url`, `points`, `author`, `created_at_i` 등

### Step 2: fetchHNStoriesAlgolia 함수 구현
- Algolia HN Search API (`hn.algolia.com/api/v1/search_by_date`) 사용
- `{daysBack, minScore, maxPages}` 옵션
- AI_KEYWORDS로 필터링
- 페이지네이션 처리
