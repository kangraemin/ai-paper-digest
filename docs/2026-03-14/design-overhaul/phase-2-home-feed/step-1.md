# Phase 2 - Step 1: source-tabs + category-chips

## 대상 파일
- `src/components/source-tabs.tsx`
- `src/components/category-chips.tsx` (신규)

## TC (Test Criteria)

| TC | 항목 | 검증 방법 | 상태 |
|----|------|----------|------|
| TC-01 | source-tabs: 3탭 (All/Papers/Community), 언더라인 active indicator | 코드 확인 | ✅ |
| TC-02 | source-tabs: border-b-[2px] 활성 표시, 비활성은 text-zinc-500 | 코드 확인 | ✅ |
| TC-03 | category-chips: 가로 스크롤 칩 레이아웃 (overflow-x-auto) | 코드 확인 | ✅ |
| TC-04 | category-chips: 카테고리별 색상 (inline style 방식) | 코드 확인 | ✅ |
| TC-05 | category-chips: 선택/미선택 상태 구분 (opacity 차이) | 코드 확인 | ✅ |
| TC-06 | `npm run build` 성공 | 빌드 실행 | ✅ |

## 실행 결과

TC-01: SOURCES 배열에 {id:'all', label:'All'}, {id:'papers', label:'Papers'}, {id:'community', label:'Community'} 3개 정의. native `<button>` 사용, border-b-[2px] 언더라인 방식.

TC-02: active → `border-b-white text-white`, inactive → `border-b-transparent text-zinc-500 hover:text-white`

TC-03: 컨테이너에 `flex gap-2 overflow-x-auto pb-2` 적용, 각 칩에 `shrink-0`

TC-04: colorMap 객체로 hex 색상 매핑, inline style로 borderColor/backgroundColor/color 적용 (Tailwind JIT 동적 클래스 문제 회피)

TC-05: active → `${hex}33` (20% opacity), inactive → `${hex}1a` (10% opacity). All Topics 칩은 active: border-zinc-600 bg-zinc-800 text-white / inactive: border-zinc-800 bg-zinc-900 text-zinc-300

TC-06: `npm run build` → Compiled successfully, 11/11 static pages generated
