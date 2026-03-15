# Step 1: PaperListItem 타입 생성

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | `src/lib/types.ts` 파일 존재 | 파일이 존재함 | ✅ |
| TC-02 | PaperListItem 타입이 export됨 | `grep 'export type PaperListItem'` 매칭 | ✅ |
| TC-03 | 12개 필드 포함 (id, title, titleKo, oneLiner, aiCategory, devRelevance, targetAudience, tags, source, isHot, publishedAt, authors) | 모든 필드 존재 | ✅ |
| TC-04 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 | ✅ |

## 실행출력

TC-01: `test -f src/lib/types.ts`
→ PASS: file exists

TC-02: `grep 'export type PaperListItem' src/lib/types.ts`
→ PASS: `export type PaperListItem = {`

TC-03: grep each of 12 fields (id, title, titleKo, oneLiner, aiCategory, devRelevance, targetAudience, tags, source, isHot, publishedAt, authors)
→ PASS: all 12 fields present

TC-04: `npx tsc --noEmit`
→ PASS: no errors (exit code 0)
