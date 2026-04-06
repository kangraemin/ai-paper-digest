# Step 1: 테스트 케이스 정의 — API 라우트 + 보안

## 대상 파일
- `src/app/api/papers/route.ts` — limit 상한 + try-catch
- `src/app/api/search/route.ts` — limit 상한
- `src/app/api/slack/events/route.ts` — JSON.parse try-catch
- `src/app/api/newsletter/route.ts` — req.json() try-catch
- `src/lib/db/queries.ts` — LIKE 패턴 이스케이프

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | papers/route.ts | limit에 Math.min 상한 적용 | `Math.min(limit, 100)` 또는 유사 상한 | ⬜ |
| TC-02 | papers/route.ts | page에 Math.max 하한 적용 | `Math.max(page, 1)` 또는 유사 하한 | ⬜ |
| TC-03 | papers/route.ts | DB 쿼리 try-catch + 500 응답 | catch 블록에서 `Response(500)` 반환 | ⬜ |
| TC-04 | search/route.ts | limit에 Math.min 상한 적용 | `Math.min(..., 100)` 상한 | ⬜ |
| TC-05 | slack/events/route.ts | JSON.parse try-catch | 파싱 실패 시 400 응답 | ⬜ |
| TC-06 | newsletter/route.ts | req.json() try-catch | 파싱 실패 시 400 응답 | ⬜ |
| TC-07 | queries.ts | LIKE 이스케이프 함수 존재 | `%` → `\%`, `_` → `\_` 변환 | ⬜ |
| TC-08 | queries.ts | 검색 쿼리에 이스케이프 적용 | pattern 생성 전 이스케이프 함수 호출 | ⬜ |

## 실행출력
(Dev가 구현 후 코드 리뷰 및 테스트 실행으로 채워짐)
