# Phase 2 - Step 3: Claude 요약 파이프라인

## 목표
Claude Haiku로 논문을 요약하고 카테고리를 분류하는 파이프라인을 구현한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | SummaryResult 타입 | types.ts에 titleKo, summaryKo, aiCategory, devRelevance 포함 | ✅ |
| TC-02 | 요약 프롬프트 | prompts.ts에 SUMMARY_PROMPT 상수 export | ✅ |
| TC-03 | summarizePaper 함수 | client.ts에 단건 요약 함수 | ✅ |
| TC-04 | summarizeBatch 함수 | client.ts에 병렬 배치 처리 (concurrency 5) | ✅ |
| TC-05 | summarize.ts 스크립트 | scripts/summarize.ts에 미요약 논문 조회 + 배치 요약 | ✅ |
| TC-06 | TypeScript 빌드 | npx tsc --noEmit 에러 없음 | ✅ |

## 구현 지시사항
- plan.md의 claude/client.ts, prompts.ts, summarize.ts 코드 참조
- Anthropic SDK 사용, 모델: claude-haiku-4-5-20251001

## 실행 결과

TC-01~05: 4개 파일 생성 (types.ts, prompts.ts, client.ts, summarize.ts)
TC-06: `npx tsc --noEmit` → 에러 없음
