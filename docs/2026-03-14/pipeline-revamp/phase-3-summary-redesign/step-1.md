# Step 1: 타입 + DB 스키마 변경

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | SummaryResult 7항목 구조 | types.ts 확인 | oneLiner, targetAudience, keyFindings, evidence, howToApply, codeExample, relatedResources 필드 존재 | ✅ |
| TC-02 | DB 스키마 7개 신규 컬럼 | schema.ts 확인 | one_liner, target_audience, key_findings, evidence, how_to_apply, code_example, related_resources 컬럼 (nullable) | ✅ |
| TC-03 | 기존 컬럼 유지 | schema.ts 확인 | summaryKo, devNote, relevanceReason 컬럼 남아있음 | ✅ |
| TC-04 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `src/lib/claude/types.ts` SummaryResult 인터페이스 확인
→ L3: `oneLiner: string;`
→ L4: `targetAudience: string;`
→ L5: `keyFindings: string;`
→ L6: `evidence: string;`
→ L7: `howToApply: string;`
→ L8: `codeExample: string;`
→ L9: `relatedResources: string[];`
→ 7개 필드 모두 존재

TC-02: `src/lib/db/schema.ts` 신규 컬럼 확인
→ L20: `oneLiner: text('one_liner'),` (nullable)
→ L21: `targetAudience: text('target_audience'),` (nullable)
→ L22: `keyFindings: text('key_findings'),` (nullable)
→ L23: `evidence: text('evidence'),` (nullable)
→ L24: `howToApply: text('how_to_apply'),` (nullable)
→ L25: `codeExample: text('code_example'),` (nullable)
→ L26: `relatedResources: text('related_resources'),` (nullable)
→ 7개 컬럼 모두 존재, 모두 nullable

TC-03: 기존 컬럼 유지 확인
→ L15: `summaryKo: text('summary_ko'),` ✅
→ L18: `relevanceReason: text('relevance_reason'),` ✅
→ L19: `devNote: text('dev_note'),` ✅

TC-04: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
