# summarize-local.ts 스크립트 생성

## 변경 파일별 상세
### `scripts/summarize-local.ts` (신규)
- **변경 이유**: Claude API 비용 없이 Claude Code 세션에서 직접 논문 요약
- **Before**: 파일 없음
- **After**: dump/update 두 모드의 CLI 스크립트
- **영향 범위**: 기존 summarize.ts 변경 없음

## 검증
- 검증 명령어: `npx tsx scripts/summarize-local.ts --dump --limit 3`
- 기대 결과: JSON 배열 출력
