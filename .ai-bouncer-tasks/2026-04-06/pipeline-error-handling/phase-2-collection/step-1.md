# Step 1: 코드 리뷰 검증 — 수집 파이프라인

## 검증 방법
코드 리뷰로 패턴 적용 여부 확인 (런타임 테스트는 Step 5에서 별도 수행)

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | collect-papers.ts | withRetry import 존재 | `import { withRetry }` L6 | ✅ |
| TC-02 | collect-papers.ts | HF API fetch를 withRetry로 감싸기 | L51-55 `withRetry(async () => { ... }, { label: 'HF API' })` | ✅ |
| TC-03 | collect-papers.ts | Promise.all → Promise.allSettled | L84 `Promise.allSettled([` | ✅ |
| TC-04 | collect-papers.ts | fulfilled/rejected 분기 처리 | L88-91 status 체크 + 빈 Map fallback + console.error | ✅ |
| TC-05 | collect-community.ts | Promise.all → Promise.allSettled | L88 `Promise.allSettled([` | ✅ |
| TC-06 | collect-community.ts | rejected 시 빈 Map fallback + 에러 로깅 | L92-95 status 체크 + 빈 Map + console.error | ✅ |
| TC-07 | hacker-news/client.ts | withRetry import 존재 | L1 `import { withRetry }` | ✅ |
| TC-08 | hacker-news/client.ts | fetchHNTopAI에 withRetry 적용 | L34-38 `withRetry(async () => { ... }, { label: 'HN topstories' })` | ✅ |
| TC-09 | hacker-news/client.ts | res.ok 체크 추가 | L36 `if (!res.ok) throw new Error(...)` | ✅ |
| TC-10 | hacker-news/client.ts | Algolia 호출에 withRetry 적용 | L88-92 `withRetry(async () => { ... }, { label: 'HN Algolia' })` | ✅ |
| TC-11 | arxiv/client.ts | retry 상한 100 → 10 | L22 `attempt <= 10` (로그 메시지 L25는 아직 `100` 표기이나 실제 루프 조건은 10) | ✅ |

## 리뷰 소견

### 확인 완료 (Good)
- **collect-papers.ts**: withRetry import + HF API 감싸기 + allSettled + rejected fallback 모두 적용
- **collect-community.ts**: allSettled + rejected fallback 패턴 동일하게 적용
- **hacker-news/client.ts**: withRetry import + topstories/Algolia 모두 감싸기 + res.ok 체크
- **arxiv/client.ts**: 루프 조건 `attempt <= 10`으로 변경 완료

### 경미한 이슈 (Minor)
- `arxiv/client.ts` L25: 로그 메시지가 `${attempt}/100`으로 남아있음 → `${attempt}/10`으로 수정 권장 (동작에 영향 없음)

## 실행출력
(코드 리뷰 기반 검증 — 런타임 테스트는 Phase 2 Step 5에서 수행)

**결과: 11/11 TC 통과 ✅**
