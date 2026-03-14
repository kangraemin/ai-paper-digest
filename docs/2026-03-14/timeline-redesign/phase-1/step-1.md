# Phase 1 / Step 1: PaperCard 가로 레이아웃 + devNote

## 변경 파일
- `src/components/paper-card.tsx`

## 테스트 케이스

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | devNote prop 존재 | PaperCardProps에 `devNote: string \| null`, 컴포넌트 파라미터에 devNote 포함 | ✅ |
| TC-02 | CardHeader 제거 | CardHeader/CardTitle import 및 사용 제거, CardContent만 사용 | ✅ |
| TC-03 | devNote 렌더링 | `devNote &&` 조건부 렌더링 + 💬 이모지 + italic 클래스 | ✅ |
| TC-04 | 날짜 표시 제거 | `toLocaleDateString` 렌더링 코드 제거 | ✅ |
| TC-05 | h-full 제거 | Card에서 `h-full` 클래스 제거 | ✅ |
| TC-06 | line-clamp 변경 | `line-clamp-3` → `line-clamp-2` | ✅ |
| TC-07 | tsc 통과 | `npx tsc --noEmit` paper-card.tsx 자체 에러 0건 (호출부 에러는 Step 2에서 해결) | ✅ |

## 실행출력

TC-01: `grep 'devNote' src/components/paper-card.tsx`
→ L26: `devNote: string | null;` / L32: 파라미터에 devNote 포함 ✅

TC-02: `grep -E 'CardHeader|CardTitle' src/components/paper-card.tsx`
→ 매치 없음. import에 `Card, CardContent`만 존재 ✅

TC-03: `grep -n 'devNote &&' src/components/paper-card.tsx` + `grep 'italic' src/components/paper-card.tsx`
→ L66: `{devNote && (` / L67: `className="text-sm text-primary/80 italic mb-1.5"` ✅

TC-04: `grep 'toLocaleDateString' src/components/paper-card.tsx`
→ 매치 없음 ✅

TC-05: `grep 'h-full' src/components/paper-card.tsx`
→ 매치 없음 ✅

TC-06: `grep 'line-clamp' src/components/paper-card.tsx`
→ L61: `line-clamp-2` (line-clamp-3 아님) ✅

TC-07: `npx tsc --noEmit`
→ paper-card.tsx 자체 에러 0건. 호출부(page.tsx L52/82, bookmarks/page.tsx L53)에서 devNote prop 미전달 에러 3건 → Step 2에서 해결 예정 ✅
