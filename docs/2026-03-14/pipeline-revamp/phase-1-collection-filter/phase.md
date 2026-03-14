# Phase 1: 수집 필터링

## 목표
arXiv 수집 단계에서 개발자 무관 논문을 필터링하여, "GPT/Claude API를 사용하는 일반 개발자"에게 유용한 논문만 수집한다.

## 범위
- `src/lib/arxiv/client.ts` — PRACTICAL_KEYWORDS 정의 + (카테고리) AND (키워드) 복합 쿼리
- `src/lib/hot-scorer.ts` — BUZZ_KEYWORDS를 실무 키워드로 교체
- `scripts/collect.ts` — fetchRecentPapers(200) → fetchRecentPapers(100)

## Steps

### Step 1: arxiv 클라이언트 키워드 필터 + collect 수량 변경
- `client.ts`: PRACTICAL_KEYWORDS 배열 추가, 쿼리를 `(cat:cs.AI OR ...) AND (abs:keyword OR ...)` 형식으로 변경
- `collect.ts`: fetchRecentPapers(200) → fetchRecentPapers(100)

### Step 2: hot-scorer 실무 키워드 교체
- `hot-scorer.ts`: BUZZ_KEYWORDS를 prompting, RAG, tool use, function calling, fine-tuning, LoRA, quantization, code generation, inference 등 실무 키워드로 교체
