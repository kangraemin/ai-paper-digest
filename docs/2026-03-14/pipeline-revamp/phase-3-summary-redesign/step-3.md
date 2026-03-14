# Step 3: 스크립트 업데이트

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | summarize-local.ts 새 필드 | grep으로 확인 | oneLiner, targetAudience 등 새 필드 저장 | ✅ |
| TC-02 | summarize-claude.sh 필드 검증 | grep으로 확인 | oneLiner 필수 필드 검증 | ✅ |
| TC-03 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `grep 'oneLiner|targetAudience|...' scripts/summarize-local.ts`
→ L28-30: 타입 정의에 oneLiner, targetAudience, keyFindings, evidence, howToApply, codeExample, relatedResources 포함
→ L37-43: DB update에 7개 필드 모두 저장
  - `oneLiner: r.oneLiner`
  - `targetAudience: r.targetAudience`
  - `keyFindings: r.keyFindings`
  - `evidence: r.evidence`
  - `howToApply: r.howToApply`
  - `codeExample: r.codeExample`
  - `relatedResources: JSON.stringify(r.relatedResources)`

TC-02: `grep 'oneLiner' scripts/summarize-claude.sh`
→ L143: `assert "titleKo" in inner and "oneLiner" in inner`
→ oneLiner 필수 필드 검증 포함

TC-03: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
