# Phase 3 - Step 1: CLI 파서 + S2 수집 로직

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | 파일 생성 | `scripts/bulk-collect.ts` 존재 | ✅ |
| TC-02 | CLI 플래그 파싱 | `--s2-only`, `--hn-only`, `--dry-run` 인식 | ✅ |
| TC-03 | S2 연도별 수집 로직 | 2022~2026 순회, 연도별 maxPapers 적용 | ✅ |
| TC-04 | TypeScript 컴파일 | `npx tsx --no-cache scripts/bulk-collect.ts --help` 에러 없음 | ✅ |

## 실행출력

TC-01: `test -f scripts/bulk-collect.ts && echo "파일 존재"`
→ 파일 존재 ✅

TC-02/03: `npx tsx --no-cache -e` 구문 검증 스크립트
→ s2-only: true / hn-only: true / dry-run: true / years: 5

TC-04: `npx tsc --noEmit scripts/bulk-collect.ts` + `npx tsx --no-cache -e "require('./scripts/bulk-collect.ts')"`
→ 자체 파일 에러 0건 (node_modules 내부 drizzle-orm 타입 에러만 존재)
→ tsx 실행 시 `🚀 벌크 수집 시작` 정상 출력 확인
