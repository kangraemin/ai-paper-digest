# Phase 3: bulk-collect 스크립트

## 목표
S2 연도별 + HN Algolia 벌크 수집 통합 스크립트 구현

## 범위
- `scripts/bulk-collect.ts` 신규 생성
- CLI 플래그: `--s2-only`, `--hn-only`, `--dry-run`
- S2: 2022~2026 연도별 수집 (2022~2024 top30, 2025~2026 max500)
- HN: 최근 6개월 Algolia 수집 (score≥50)
- 전 구간 스크리닝 (`screenBatch` 재사용)
- DB 저장 (기존 collect-popular.ts, collect-hn.ts 패턴 참조)

## Steps

### Step 1: CLI 파서 + S2 수집 로직
- `--s2-only`, `--hn-only`, `--dry-run` 파싱
- S2 연도별 수집 + 스크리닝 + DB 저장

### Step 2: HN Algolia 수집 로직
- HN Algolia 수집 + 스크리닝 + DB 저장

### Step 3: 통합 + dry-run 검증
- 전체 흐름 통합
- `--dry-run` 모드 검증 (수량만 출력, DB 저장 안 함)
