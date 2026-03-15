# HN 전용 스크리너 분리

## 변경 파일별 상세

### `src/lib/claude/screener.ts`
- **변경 이유**: HN 전용 스크리닝 프롬프트 추가, source 파라미터로 분기
- SCREEN_PROMPT → PAPER_SCREEN_PROMPT (이름만 변경)
- HN_SCREEN_PROMPT 신규 추가 ("When in doubt, PASS" 기조)
- screenPaper, screenBatch에 source: 'paper' | 'hn' 파라미터 추가

### `scripts/bulk-collect.ts`
- **변경 이유**: HN 수집 시 source: 'hn' 전달
- screenBatch 호출에 3번째 인자 'hn' 추가

### `scripts/collect-hn.ts`
- **변경 이유**: 단독 HN 수집도 source: 'hn' 전달
- screenBatch 호출에 3번째 인자 'hn' 추가

## 검증
- `npx tsc --noEmit` 에러 없음
- grep으로 프롬프트 분리 + source 파라미터 전달 확인
