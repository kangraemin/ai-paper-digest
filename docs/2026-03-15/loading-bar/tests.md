| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | npx tsc --noEmit | 에러 0개 | ✅ |
| TC-02 | npm run build | 빌드 성공, / 페이지 ○ Static + Revalidate 1h | ✅ |
| TC-03 | header.tsx에 Search/Submit 없음 | Search, SubmitPaperModal import 없음 | ✅ |
| TC-04 | paper-card.tsx 하단 제거 | Code, Target import 없음, audienceLabel 없음 | ✅ |
| TC-05 | globals.css에 cursor-pointer + loading-bar | 두 규칙 모두 존재 | ✅ |
| TC-06 | page.tsx searchParams 제거 | searchParams 문자열 없음 | ✅ |

## 실행출력

TC-01: `npx tsc --noEmit`
→ 출력 없음 (에러 0개)

TC-02: `npm run build`
→ ○ / 6.7 kB 124 kB 1h 1y (Static, Revalidate 1h)

TC-03: `grep -c 'Search\|SubmitPaperModal' src/components/header.tsx`
→ 0

TC-04: `grep -c 'Code\|Target\|audienceLabel' src/components/paper-card.tsx`
→ 0

TC-05: `grep -c 'loading-bar\|cursor: pointer' src/app/globals.css`
→ 2

TC-06: `grep -c 'searchParams' src/app/page.tsx`
→ 0
