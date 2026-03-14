# Phase 1: S2 Client 확장

## 목표
Semantic Scholar client에 연도별 논문 조회 함수 추가

## 범위
- `src/lib/semantic-scholar/client.ts`에 `fetchPapersByYear`, `fetchAllPapersForYear` 함수 추가
- 기존 `fetchPopularPapers` 유지

## Steps

### Step 1: fetchPapersByYear 함수 구현
- S2 API `/paper/search`에 `year` 파라미터 추가
- `{limit, offset}` 옵션 지원
- `citationCount` 정렬

### Step 2: fetchAllPapersForYear 함수 구현
- `fetchPapersByYear`를 반복 호출하여 페이지네이션 처리
- `maxPapers` 제한 (기본 500)
- rate limit 대응 (1초 딜레이)
