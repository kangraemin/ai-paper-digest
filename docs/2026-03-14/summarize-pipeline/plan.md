# 논문 요약 파이프라인

## 변경 파일별 상세
### `src/lib/claude/prompts.ts`
- **변경 이유**: summaryKo/devNote 품질 개선
- **Before**: summaryKo 3~5줄, devNote relevance 1~2이면 빈 문자열
- **After**: summaryKo 5~8줄 (문제/방법/결과/의의), devNote 모든 논문에 작성

### `scripts/summarize-claude.sh` (신규)
- **용도**: claude -p 파이프라인 자동화
- **Before**: 없음
- **After**: dump → claude -p → update 파이프라인

## 검증
- `npx tsc --noEmit`
- `bash scripts/summarize-claude.sh --limit 2`
