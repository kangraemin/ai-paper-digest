# Step 1: PaperCard + 메인/북마크 + RSS + 검색

## TC

| TC ID | 검증 항목 | 검증 방법 | 기대 결과 | 상태 |
|-------|----------|----------|----------|------|
| TC-01 | PaperCard props 변경 | paper-card.tsx 확인 | oneLiner, targetAudience props 사용 | ✅ |
| TC-02 | page.tsx props 교체 | page.tsx 확인 | oneLiner, targetAudience 전달 | ✅ |
| TC-03 | bookmarks props 교체 | bookmarks/page.tsx 확인 | oneLiner, targetAudience 포함 | ✅ |
| TC-04 | RSS oneLiner 사용 | rss/route.ts 확인 | description에 oneLiner 사용 | ✅ |
| TC-05 | 검색 대상 확장 | queries.ts 확인 | keyFindings 검색 포함 | ✅ |
| TC-06 | tsc --noEmit 에러 0 | npx tsc --noEmit | 에러 0 | ✅ |

## 실행출력

TC-01: `grep 'oneLiner|targetAudience' src/components/paper-card.tsx`
→ L16: `oneLiner: string | null;` (props 정의)
→ L19: `targetAudience: string | null;` (props 정의)
→ L25: 컴포넌트에서 props 사용
→ L34-36: targetAudience 렌더링
→ L51: oneLiner 렌더링

TC-02: `grep 'oneLiner|targetAudience' src/app/page.tsx`
→ L89: `oneLiner={paper.oneLiner}`
→ L92: `targetAudience={paper.targetAudience}`

TC-03: `grep 'oneLiner|targetAudience' src/app/bookmarks/page.tsx`
→ L11: `oneLiner: string | null;`
→ L14: `targetAudience: string | null;`

TC-04: `grep 'oneLiner' src/app/api/rss/route.ts`
→ L31: `<description>${escapeXml(p.oneLiner || p.abstract)}</description>`

TC-05: `grep 'keyFindings' src/lib/db/queries.ts`
→ L16: `like(papers.keyFindings, pattern),`
→ L31: `like(papers.keyFindings, pattern),`

TC-06: `npx tsc --noEmit`
→ 출력 없음 (에러 0)
