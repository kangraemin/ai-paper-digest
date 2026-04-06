# Step 1: 코드 리뷰 검증 — API 라우트 + 보안

## 대상 파일
- `src/app/api/papers/route.ts` — limit 상한 + try-catch
- `src/app/api/search/route.ts` — limit 상한
- `src/app/api/slack/events/route.ts` — JSON.parse try-catch
- `src/lib/db/queries.ts` — LIKE 패턴 이스케이프

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | papers/route.ts | limit에 Math.min 상한 적용 | L15 `Math.min(Math.max(1, ...), 100)` | ✅ |
| TC-02 | papers/route.ts | page에 Math.max 하한 적용 | L14 `Math.max(1, ...)` | ✅ |
| TC-03 | papers/route.ts | DB 쿼리 try-catch + 500 응답 | L42 `try {` ~ L77-80 `catch (e) { console.error(...); return 500 }` | ✅ |
| TC-04 | search/route.ts | limit에 Math.min 상한 적용 | L8 `Math.min(Math.max(1, ...), 100)` | ✅ |
| TC-05 | slack/events/route.ts | JSON.parse try-catch | L20-21 `try { payload = JSON.parse(body); } catch { return 400 }` | ✅ |
| TC-06 | newsletter/route.ts | req.json() try-catch | (Phase 7 phase.md에 기재되었으나 커밋에 포함되지 않음 — 확인 필요) | ⚠️ |
| TC-07 | queries.ts | LIKE 이스케이프 존재 | L6 `query.replace(/%/g, '\\%').replace(/_/g, '\\_')` | ✅ |
| TC-08 | queries.ts | 검색 쿼리에 이스케이프 적용 | L7 `\`%${escaped}%\`` — escaped 변수 사용 | ✅ |

## 리뷰 소견

### 확인 완료 (Good)
- **papers/route.ts**: page `Math.max(1, ...)` (L14) + limit `Math.min(..., 100)` (L15) + 전체 try-catch (L42-80) + 500 응답 — 완벽 적용
- **search/route.ts**: limit `Math.min(Math.max(1, ...), 100)` (L8) — 상한 적용
- **slack/events/route.ts**: `JSON.parse(body)` try-catch (L20-21) + 400 응답 — 적용 완료
- **queries.ts**: `%` → `\%`, `_` → `\_` 이스케이프 (L6) + escaped 변수로 pattern 생성 (L7) — SQL injection 방어

### 미확인 (TC-06)
- **newsletter/route.ts**: phase.md에 `req.json() try-catch` 명시되었으나, 이번 커밋 diff에 해당 파일 변경 없음. Dev에 확인 필요.

## 실행출력

**QA 코드 리뷰 검증 완료**

**결과: 7/8 TC 통과 ✅ (TC-06 미확인 ⚠️)**
