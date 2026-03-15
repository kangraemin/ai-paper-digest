# Step 2: page.tsx 리팩토링

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | force-dynamic 제거 | `export const dynamic` 없음 | ✅ |
| TC-02 | revalidate 설정 | `export const revalidate = 3600` 존재 | ✅ |
| TC-03 | PaperFeed import | `import { PaperFeed }` 존재 | ✅ |
| TC-04 | PaperListItem import | `import type { PaperListItem }` 존재 | ✅ |
| TC-05 | 컬럼 프로젝션 | `db.select({...})` 형태로 12개 필드 선택 | ✅ |
| TC-06 | limit 20 | `.limit(20)` | ✅ |
| TC-07 | PaperFeed에 initialPapers/initialSource/initialCategory 전달 | JSX에 3개 props 전달 | ✅ |
| TC-08 | SourceTabs/CategoryChips/PaperCard/Suspense 직접 import 제거 | 해당 import 없음 | ✅ |
| TC-09 | TimelineFeed/formatDateHeader/groupByDate 함수 제거 | 해당 함수 없음 | ✅ |
| TC-10 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 | ✅ |
| TC-11 | npm run build 성공 | 빌드 성공 | ✅ |

## 실행출력

TC-01: `grep -c 'export const dynamic' src/app/page.tsx`
→ 0 (force-dynamic 제거 확인)

TC-02: `grep 'export const revalidate' src/app/page.tsx`
→ export const revalidate = 3600;

TC-03: `grep "import { PaperFeed }" src/app/page.tsx`
→ import { PaperFeed } from "@/components/paper-feed";

TC-04: `grep "import type { PaperListItem }" src/app/page.tsx`
→ import type { PaperListItem } from "@/lib/types";

TC-05: `grep -c 'db.select({' src/app/page.tsx`
→ 1 (컬럼 프로젝션 사용 확인: id, title, titleKo, oneLiner, aiCategory, devRelevance, targetAudience, tags, source, isHot, publishedAt, authors)

TC-06: `grep '.limit(20)' src/app/page.tsx`
→ .limit(20);

TC-07: `grep -E 'initialPapers|initialSource|initialCategory' src/app/page.tsx`
→ initialPapers={items}
  initialSource={source || 'all'}
  initialCategory={category || 'all'}

TC-08: `grep -E 'SourceTabs|CategoryChips|PaperCard|Suspense' src/app/page.tsx`
→ (출력 없음 — 해당 import 모두 제거됨)

TC-09: `grep -E 'TimelineFeed|formatDateHeader|groupByDate' src/app/page.tsx`
→ (출력 없음 — 해당 함수 모두 제거됨)

TC-10: `npx tsc --noEmit`
→ (에러 없음 — 전체 프로젝트 타입 체크 통과)

TC-11: `npm run build`
→ ✓ Compiled successfully in 2.4s
  ✓ Generating static pages (12/12)
  Route /: 7.55 kB, First Load JS 125 kB
  빌드 성공

## 실행 결과

모든 TC 통과. page.tsx에서 force-dynamic 제거, revalidate=3600 설정, 컬럼 프로젝션(12필드), limit 100→20 축소, PaperFeed 클라이언트 컴포넌트 위임 완료. 빌드 및 타입 체크 모두 성공.
