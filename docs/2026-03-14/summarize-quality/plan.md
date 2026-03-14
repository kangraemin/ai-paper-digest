# 요약 품질 개선

## 변경 파일별 상세
### `scripts/summarize-claude.sh`
- **변경 이유**: abstract→본문, haiku→sonnet
- **Before**: abstract만 사용, haiku 모델
- **After**: arxiv HTML 본문 fetch, sonnet 모델

### `src/lib/claude/prompts.ts`
- **변경 이유**: 프롬프트 톤 강화
- **Before**: "개발자 친구에게 설명하듯"
- **After**: 구체적 금지/허용 톤 규칙

## 검증
- `SUMMARIZE_LIMIT=2 bash scripts/summarize-claude.sh`
- DB summaryKo 확인
