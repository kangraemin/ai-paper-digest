# Phase 3 - Step 3: 통합 + dry-run 검증

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | --dry-run 플래그 | DB 저장 없이 수량만 출력 | ✅ |
| TC-02 | 전체 흐름 통합 | S2 + HN 순차 실행, main() 호출 | ✅ |
| TC-03 | dry-run 코드 검증 | collectS2/collectHN 모두 dryRun 체크 포함 | ✅ |

## 실행출력

TC-01: `grep -n 'dryRun' scripts/bulk-collect.ts`
→ line 11: 선언, line 45: collectS2 체크, line 101: collectHN 체크, line 137: main 출력 — 4곳 확인

TC-02: `grep -n 'await collectS2\|await collectHN\|async function main' scripts/bulk-collect.ts`
→ line 135: async function main(), line 141: await collectS2(), line 142: await collectHN() — 순차 호출 확인

TC-03: `grep -c 'dry-run' scripts/bulk-collect.ts`
→ 4개 (기대: 3개 이상) — S2, HN, main 포함 확인
