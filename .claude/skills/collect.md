---
name: collect
description: ai-paper-digest 프로젝트에서 논문/커뮤니티 콘텐츠 수집 → 스크리닝 → 요약 → 번역 전체 파이프라인을 Claude Code가 직접 수행. "collect", "수집", "오늘 논문", "논문 가져와", "논문 수집해" 등의 요청 시 반드시 이 스킬을 사용할 것. ANTHROPIC_API_KEY 없이 에이전트 기반으로 전체 파이프라인을 처리한다.
---

# collect 파이프라인

ANTHROPIC_API_KEY 없이 Claude Code 에이전트가 직접 수행하는 수집 파이프라인.

## 전제 조건

- 작업 디렉토리: `/Users/ram/programming/vibecoding/ai-paper`
- `.env`에 `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN` 있어야 함
- `ANTHROPIC_API_KEY`는 없어도 됨 (screenBatch 자동 스킵)

## 실행 순서

### 1. 수집

```bash
export $(grep -E '^TURSO_' .env | xargs) && npx tsx scripts/collect-papers.ts
export $(grep -E '^TURSO_' .env | xargs) && npx tsx scripts/collect-community.ts
```

### 2. 새로 수집된 논문 확인

```bash
# 오늘 수집된 미요약 논문 목록
export $(grep -E '^TURSO_' .env | xargs) && npx tsx -e "
import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
const rows = await (async () => {
  const r = await db.execute(\"SELECT id, title, source, abstract FROM papers WHERE summarized_at IS NULL ORDER BY collected_at DESC\");
  return r.rows;
})();
console.log(JSON.stringify(rows));
"
```

### 3. 스크리닝 (Claude가 직접)

수집된 논문 제목/내용을 보고 AI 개발자에게 유용하지 않은 것 삭제.

**PASS 기준**: AI 개발자가 즉시 적용 가능한 프롬프팅, 에이전트, 보안, 워크플로우 관련
**REJECT 기준**: 순수 수학, 모델 학습 이론, 의료/법률 도메인, 뉴스/공지만 있는 것

스크리닝 후 탈락 논문 DB에서 삭제:
```bash
export $(grep -E '^TURSO_' .env | xargs) && npx tsx -e "
import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_DATABASE_URL!, authToken: process.env.TURSO_AUTH_TOKEN! });
const ids = ['id1', 'id2']; // 탈락 ID 목록
for (const id of ids) {
  await db.execute({ sql: 'DELETE FROM papers WHERE id = ?', args: [id] });
}
console.log('삭제 완료:', ids.length);
"
```

### 4. 요약 (에이전트 병렬)

미요약 논문을 배치로 나눠 에이전트 병렬 스폰.
오늘 번역할 때와 동일한 방식: 에이전트가 DB 조회 → 요약 작성 → UPDATE.

요약 필드:
- `title_ko`: 한국어 제목
- `one_liner`: 한 줄 요약 (한국어)
- `target_audience`: 대상 독자 (한국어)
- `key_findings`: JSON array (한국어, 3-5개)
- `evidence`: JSON array (한국어, 2-3개)
- `how_to_apply`: JSON array (한국어, 2-3개)
- `glossary`: JSON array (한국어, 2-4개)
- `tags`: JSON array - 허용값: ["에이전트","프롬프트엔지니어링","RAG","파인튜닝","코드생성","멀티모달","평가","벤치마크","보안","프롬프트인젝션","도구사용","함수호출","추론최적화","양자화","캐싱","레드팀","프라이버시","임베딩","벡터검색","청킹","MCP","LoRA","RLHF"]
- `ai_category`: "prompting"|"rag"|"agent"|"fine-tuning"|"eval"|"security"|"cost-speed"
- `dev_relevance`: 1-5 (개발자 관련도)
- `summarized_at`: new Date().toISOString()

UPDATE 쿼리:
```sql
UPDATE papers SET title_ko=?, one_liner=?, target_audience=?, key_findings=?, evidence=?, how_to_apply=?, glossary=?, tags=?, ai_category=?, dev_relevance=?, summarized_at=? WHERE id=?
```

### 5. 번역 (에이전트 병렬)

요약 완료 후 영어 번역. 번역 필드:
- `one_liner_en`, `target_audience_en`, `key_findings_en`, `evidence_en`, `how_to_apply_en`, `glossary_en`, `tags_en`

Tags 매핑: 에이전트→Agent, 프롬프트엔지니어링→Prompt Engineering, RAG→RAG, 파인튜닝→Fine-tuning, 코드생성→Code Generation, 멀티모달→Multimodal, 평가→Evaluation, 벤치마크→Benchmark, 보안→Security, 프롬프트인젝션→Prompt Injection, 도구사용→Tool Use, 함수호출→Function Calling, 추론최적화→Inference Optimization, 양자화→Quantization, 캐싱→Caching, 레드팀→Red Team, 프라이버시→Privacy, 임베딩→Embedding, 벡터검색→Vector Search, 청킹→Chunking, MCP→MCP, LoRA→LoRA, RLHF→RLHF

### 6. Vercel 재배포

```bash
vercel deploy --prod
```

### 7. 완료 보고

수집/스크리닝/요약/번역 각 단계 결과 요약 출력.
