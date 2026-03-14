# Step 1: arxiv 클라이언트 키워드 필터 + collect 수량 변경

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | PRACTICAL_KEYWORDS 배열 존재 및 키워드 목록 | `grep -c 'PRACTICAL_KEYWORDS' src/lib/arxiv/client.ts` + 배열 내용 확인 | 20개 이상 실무 키워드 포함 | ✅ |
| TC-02 | 쿼리 문자열에 AND + abs: 키워드 포함 | `grep 'AND' src/lib/arxiv/client.ts` + 쿼리 구성 로직 확인 | `(cat:...) AND (abs:...)` 형식 | ✅ |
| TC-03 | collect.ts fetchRecentPapers 호출 인자 변경 | `grep 'fetchRecentPapers' scripts/collect.ts` | fetchRecentPapers(100)으로 호출 | ✅ |
| TC-04 | TypeScript 컴파일 통과 | `npx tsc --noEmit` | 에러 0 | ✅ |

## 실행출력

TC-01: `grep 'PRACTICAL_KEYWORDS' src/lib/arxiv/client.ts`
→ 2건 매치 (배열 정의 L7 + 쿼리 사용 L17)
→ 키워드 22개: prompting, prompt engineering, RAG, retrieval-augmented, agent, tool use, function calling, fine-tuning, LoRA, RLHF, DPO, inference, quantization, distillation, eval, benchmark, code generation, in-context learning, chain-of-thought, embedding, chunking, vector search

TC-02: `grep 'AND' src/lib/arxiv/client.ts`
→ L18: `const query = \`(\${catQuery})+AND+(\${absQuery})\`;`
→ catQuery = `cat:cs.AI+OR+cat:cs.CL+OR+cat:cs.LG`, absQuery = `abs:prompting+OR+abs:RAG+OR+...`

TC-03: `grep 'fetchRecentPapers' scripts/collect.ts`
→ L8: `const fetched = await fetchRecentPapers(100);`

TC-04: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
