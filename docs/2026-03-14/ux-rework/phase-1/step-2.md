# Phase 1 - Step 2: prompts.ts 카테고리 교체

## 변경 대상
- `src/lib/claude/prompts.ts`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | 카테고리 목록 | prompting, rag, agent, fine-tuning, eval, cost-speed 6개만 존재 | ⬜ |
| TC-02 | 이전 카테고리 제거 | nlp, cv, rl, multimodal, reasoning, optimization, safety, architecture, other 없음 | ⬜ |
| TC-03 | 카테고리 설명 | 각 카테고리에 실무 키워드 설명 포함 | ⬜ |
| TC-04 | TypeScript 문법 | 빌드 에러 없음 | ⬜ |
