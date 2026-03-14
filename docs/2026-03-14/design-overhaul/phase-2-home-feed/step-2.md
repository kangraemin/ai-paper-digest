# Phase 2 - Step 2: paper-card + page.tsx 레이아웃

## 대상 파일
- `src/components/paper-card.tsx`
- `src/app/page.tsx`

## TC (Test Criteria)

| TC | 항목 | 검증 방법 | 상태 |
|----|------|----------|------|
| TC-01 | paper-card: bg-zinc-900 배경, border-l-[3px] 카테고리색 | 코드 확인 | ✅ |
| TC-02 | paper-card: [Category] 배지, title, line-clamp-2 설명 | 코드 확인 | ✅ |
| TC-03 | paper-card: "For: audience" + "N% Match" 하단 표시 | 코드 확인 | ✅ |
| TC-04 | page.tsx: max-w-[800px] 자체 지정 | 코드 확인 | ✅ |
| TC-05 | page.tsx: SourceTabs + CategoryChips 필터 섹션 | 코드 확인 | ✅ |
| TC-06 | page.tsx: dot indicator 날짜 그룹 스타일 | 코드 확인 | ✅ |
| TC-07 | `npm run build` 성공 | 빌드 실행 | ✅ |

## 실행 결과

TC-01: paper-card.tsx — 카드 컨테이너에 `bg-zinc-900 border border-zinc-800 border-l-[3px]` 적용, `style={{ borderLeftColor: catColor }}` 로 카테고리별 동적 색상.

TC-02: `[{catName}]` 형태 배지 렌더링 (inline style color/backgroundColor), `text-[16px] font-semibold text-zinc-100` 제목, `text-[14px] text-zinc-400 leading-relaxed line-clamp-2` 설명.

TC-03: 하단 border-t 구분선 아래 `<Code size={14} />` 아이콘 + `For: {targetAudience}`, `<Target size={14} />` 아이콘 + `{devRelevance}% Match` (catColor 적용).

TC-04: Home 컴포넌트 최상위 div에 `w-full max-w-[800px] flex flex-col px-4 sm:px-6 py-6` 적용.

TC-05: 필터 섹션에 `<SourceTabs />` + `<div className="mt-4"><CategoryChips /></div>` 배치, `border-b border-zinc-800 pb-4 mb-8` 구분.

TC-06: 날짜 그룹 헤더를 `<h2>` + `<span className="w-2 h-2 rounded-full bg-zinc-600 inline-block" />` dot indicator로 변경. 기존 line divider 방식 제거.

TC-07: `npm run build` → Compiled successfully, 11/11 static pages generated, 0 errors.
