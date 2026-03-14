# Step 2: 프롬프트 + 클라이언트 변경

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | 프롬프트 7항목 구조 | prompts.ts 확인 | oneLiner, targetAudience, keyFindings, evidence, howToApply, codeExample, relatedResources 지시 포함 | ✅ |
| TC-02 | 개발자 톤 규칙 | prompts.ts 확인 | 논문체 금지, 슬랙 톤 규칙 포함 | ✅ |
| TC-03 | max_tokens 변경 | client.ts 확인 | max_tokens: 2000 | ✅ |
| TC-04 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `src/lib/claude/prompts.ts` 7항목 확인
→ L6: `oneLiner: 한줄 요약`
→ L7: `targetAudience: 누가 읽으면 좋은지`
→ L9: `keyFindings: 주요 내용`
→ L14: `evidence: 근거`
→ L16: `howToApply: 어떻게 적용해볼 수 있는지`
→ L18: `codeExample: 바로 써볼 수 있는 코드 스니펫`
→ L21: `relatedResources: 관련 리소스 배열`
→ 7개 항목 모두 존재

TC-02: 톤 규칙 확인
→ L10: `논문체/번역체 절대 금지. "~를 제안한다", "~를 달성했다" 금지.`
→ L11: `개발자 슬랙에 공유하는 톤. "~인데, ~해봤더니 ~더라" 식.`
→ L15: `"성능이 좋았다" 같은 애매한 표현 금지`

TC-03: `grep 'max_tokens' src/lib/claude/client.ts`
→ L10: `max_tokens: 2000,`

TC-04: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
