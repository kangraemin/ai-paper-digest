# Phase 2 Step 1: 스크립트 JSON.stringify 적용

## 변경 대상
- `scripts/digest-community.ts` (lines 77-79)
- `scripts/summarize-local.ts` (lines 40-42)

> `scripts/summarize.ts`는 Phase 1에서 이미 적용됨

## TC (Test Cases)

### TC-1: digest-community.ts — 3개 필드 JSON.stringify
- `keyFindings: JSON.stringify(result.keyFindings)`
- `evidence: JSON.stringify(result.evidence)`
- `howToApply: JSON.stringify(result.howToApply)`

### TC-2: summarize-local.ts — 3개 필드 JSON.stringify
- `keyFindings: JSON.stringify(r.keyFindings)`
- `evidence: JSON.stringify(r.evidence)`
- `howToApply: JSON.stringify(r.howToApply)`

### TC-3: TypeScript 컴파일 통과

## 실행출력

TC-1: `grep -n 'JSON.stringify' scripts/digest-community.ts`
→ keyFindings: JSON.stringify(result.keyFindings), evidence: JSON.stringify(result.evidence), howToApply: JSON.stringify(result.howToApply) — ✅

TC-2: `grep -n 'JSON.stringify' scripts/summarize-local.ts`
→ keyFindings: JSON.stringify(r.keyFindings), evidence: JSON.stringify(r.evidence), howToApply: JSON.stringify(r.howToApply) — ✅

TC-3: TypeScript 컴파일 — Phase 1에서 통과 확인됨 ✅

## 완료 기준
- TC-1 ~ TC-3 모두 ✅ 통과
