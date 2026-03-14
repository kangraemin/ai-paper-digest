# Phase 1 - Step 2: prompts.ts 카테고리 교체

## 변경 대상
- `src/lib/claude/prompts.ts`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | 카테고리 목록 | prompting, rag, agent, fine-tuning, eval, cost-speed 6개만 존재 | ✅ |
| TC-02 | 이전 카테고리 제거 | nlp, cv, rl, multimodal, reasoning, optimization, safety, architecture, other 없음 | ✅ |
| TC-03 | 각 카테고리 설명 | 실무 키워드 포함 (프롬프팅, 검색 증강, 에이전트, 파인튜닝, 벤치마크, 추론 최적화 등) | ✅ |
| TC-04 | 나머지 프롬프트 유지 | titleKo, summaryKo, devRelevance, relevanceReason, devNote 필드 변경 없음 | ✅ |

## 실행 결과

TC-01: 카테고리 목록 확인
→ prompting, rag, agent, fine-tuning, eval, cost-speed 6개 존재

TC-02: 이전 카테고리 제거 확인
→ nlp, cv, rl 등 이전 카테고리 모두 제거됨

TC-03: 실무 키워드 확인
→ 각 카테고리에 실무 키워드 포함 (CoT, 임베딩, MCP, LoRA, 레드팀, 양자화 등)

TC-04: 나머지 필드 유지 확인
→ titleKo, summaryKo, devRelevance, relevanceReason, devNote 변경 없음
