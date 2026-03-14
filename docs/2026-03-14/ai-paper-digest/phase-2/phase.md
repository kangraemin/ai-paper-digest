# Phase 2: Data Pipeline (데이터 수집)

## 목표
arXiv, Semantic Scholar에서 논문을 수집하고, Claude Haiku로 요약하는 전체 데이터 파이프라인을 구축한다.

## 범위
- arXiv Atom Feed API 클라이언트 (XML 파싱)
- 수집 스크립트 + GitHub Actions Cron
- Semantic Scholar API 클라이언트 (인기 논문)
- hotScore 계산 로직
- Claude Haiku 요약 파이프라인 (배치 처리)

## Steps

### Step 1: arXiv 클라이언트
- `src/lib/arxiv/types.ts` — ArxivEntry 타입 정의
- `src/lib/arxiv/client.ts` — Atom Feed 수집 + XML 파싱
- 검증: `npx tsc --noEmit` 타입 체크 통과

### Step 2: 수집 스크립트 + GitHub Actions
- `scripts/collect.ts` — arXiv 신규 논문 수집 → DB 저장
- `scripts/collect-popular.ts` — Semantic Scholar 인기 논문 수집
- `src/lib/semantic-scholar/client.ts` — Semantic Scholar API 클라이언트
- `src/lib/hot-scorer.ts` — hotScore 계산
- `.github/workflows/collect.yml` — Cron 워크플로우
- 검증: `npx tsc --noEmit` + 스크립트 실행 → DB 저장 확인

### Step 3: Claude 요약 파이프라인
- `src/lib/claude/client.ts` — Anthropic SDK 래퍼 + 배치 처리
- `src/lib/claude/prompts.ts` — 요약 프롬프트
- `src/lib/claude/types.ts` — SummaryResult 타입
- `scripts/summarize.ts` — 배치 요약 스크립트
- 검증: 타입 체크 통과 + 논문 3개 요약 생성 확인
