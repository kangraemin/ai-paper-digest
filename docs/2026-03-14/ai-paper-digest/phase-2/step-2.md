# Phase 2 - Step 2: 수집 스크립트 + GitHub Actions

## 목표
arXiv/Semantic Scholar 수집 스크립트와 hotScore 계산, GitHub Actions 워크플로우를 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | collect.ts | scripts/collect.ts에 arXiv 수집 → DB 저장 로직 | ✅ |
| TC-02 | collect-popular.ts | scripts/collect-popular.ts에 Semantic Scholar 인기 논문 수집 | ✅ |
| TC-03 | S2 클라이언트 | src/lib/semantic-scholar/client.ts + types.ts 존재 | ✅ |
| TC-04 | hotScore 계산 | src/lib/hot-scorer.ts에 calculateHotScore 함수 | ✅ |
| TC-05 | GitHub Actions | .github/workflows/collect.yml 워크플로우 정의 | ✅ |
| TC-06 | TypeScript 빌드 | npx tsc --noEmit 에러 없음 | ✅ |

## 구현 지시사항
- plan.md의 scripts/collect.ts, hot-scorer.ts, collect.yml 코드 참조
- Semantic Scholar API: GET /paper/search 사용

## 실행 결과

TC-01~05: 6개 파일 모두 생성 확인
TC-06: `npx tsc --noEmit` → 에러 없음
