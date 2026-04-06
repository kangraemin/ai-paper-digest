# Step 1: 테스트 케이스 정의 — 요약/번역 파이프라인

## 대상 파일
- `scripts/summarize.ts` — failed 카운트
- `src/lib/claude/runner.ts` — catch 블록 console.warn
- `src/lib/claude/client.ts` — JSON.parse try-catch
- `scripts/translate.ts` — withRetry + JSON try-catch
- `src/lib/gemma/client.ts` — withRetry 적용
- `scripts/digest-community.ts` — 빈 catch 수정 + JSON try-catch

## 테스트 케이스

| TC | 파일 | 검증 항목 | 기대 결과 | 상태 |
|----|------|----------|----------|------|
| TC-01 | summarize.ts | failed 카운터 변수 존재 | L16 `let failed = 0` + L72 `failed++` | ✅ |
| TC-02 | summarize.ts | 완료 로그에 failed 수 포함 | L76 `(failed: ${failed})` | ✅ |
| TC-03 | runner.ts | catch 블록에 console.warn 추가 | L47 `console.warn('[claude-runner] JSON parse failed, returning raw output')` | ✅ |
| TC-04 | client.ts | JSON.parse를 try-catch로 감싸기 | L31-36 try-catch + `console.error` + throw | ✅ |
| TC-05 | translate.ts | withRetry import 및 callGemma 감싸기 | L4 import + L84 `withRetry(() => callGemma(prompt), { label: ..., retries: 2 })` | ✅ |
| TC-06 | translate.ts | JSON.parse를 try-catch로 감싸기 | L88-89 try-catch + throw Error | ✅ |
| TC-07 | gemma/client.ts | withRetry import 존재 | L1 `import { withRetry }` | ✅ |
| TC-08 | gemma/client.ts | fetch를 withRetry로 감싸기 + res.ok 체크 | L13-30 `withRetry(async () => { ... if (!r.ok) throw ... }, { label: 'Gemma API', retries: 3 })` | ✅ |
| TC-09 | digest-community.ts | 빈 catch → catch(e) + console.warn | L46-48 `catch (e) { console.warn(...) }` — 빈 catch 제거됨 | ✅ |
| TC-10 | digest-community.ts | JSON.parse를 try-catch + continue | L77-81 `try { result = JSON.parse(...) } catch (e) { console.error(...); continue; }` | ✅ |

## 리뷰 소견

### 확인 완료 (Good)
- **summarize.ts**: `let failed = 0` (L16), catch에서 `failed++` (L72), 완료 로그에 `(failed: ${failed})` (L76) — 모두 적용
- **runner.ts**: jsonOutput 모드에서 JSON.parse 실패 시 `console.warn` (L47) + raw output fallback (L48) — 적용 완료
- **client.ts**: `JSON.parse(jsonMatch[0])` try-catch (L31-36) + `console.error` 로깅 + throw — 적용 완료
- **translate.ts**: `withRetry(() => callGemma(prompt), { label, retries: 2 })` (L84) + JSON.parse try-catch (L88-89) — 적용 완료
- **gemma/client.ts**: `withRetry` import (L1) + fetch 감싸기 (L13-30) + `!r.ok` 체크 (L25-28) — 적용 완료
- **digest-community.ts**: Reddit JSON API catch에 `console.warn` (L47), extractJson JSON.parse try-catch + continue (L77-81) — 적용 완료

## 실행출력

**QA 코드 리뷰 검증 (KST)**

**결과: 10/10 TC 통과 ✅**
