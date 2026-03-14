# Phase 1 - Step 2: header.tsx 리디자인

## 대상 파일
- `src/components/header.tsx`

## TC (Test Criteria)

| TC | 항목 | 검증 방법 | 상태 |
|----|------|----------|------|
| TC-01 | header가 전체 폭(w-full), h-14, border-b border-zinc-800 | 코드 확인 | ✅ |
| TC-02 | 배경색 bg-zinc-950/90, backdrop-blur-sm | 코드 확인 | ✅ |
| TC-03 | 로고: font-mono, ">" prefix + "paper.digest_" | 코드 확인 | ✅ |
| TC-04 | 네비게이션: Search, Bookmark 아이콘 버튼 (Lucide React) | 코드 확인 | ✅ |
| TC-05 | 아이콘 버튼: h-8 w-8, bg-zinc-900, hover:bg-zinc-800, border border-zinc-800 | 코드 확인 | ✅ |
| TC-06 | ThemeToggle 제거 (다크 모드 전용) | 코드 확인 | ✅ |
| TC-07 | `npm run build` 성공 | 빌드 실행 | ✅ |

## 실행 결과

TC-01: `grep -c 'w-full\|h-14\|border-b border-zinc-800' src/components/header.tsx`
→ w-full: 1, h-14: 1, border-b border-zinc-800: 1 — header 태그에 모두 포함

TC-02: `grep -c 'bg-zinc-950/90\|backdrop-blur-sm' src/components/header.tsx`
→ bg-zinc-950/90: 1, backdrop-blur-sm: 1

TC-03: `grep 'paper.digest_' src/components/header.tsx`
→ `<span className="text-zinc-400">{'>'}</span> paper.digest_` — font-mono 클래스 포함

TC-04: `grep "import.*Search.*Bookmark.*lucide-react" src/components/header.tsx`
→ `import { Search, Bookmark } from 'lucide-react';`

TC-05: `grep -c 'h-8 w-8\|bg-zinc-900\|hover:bg-zinc-800' src/components/header.tsx`
→ h-8 w-8: 2, bg-zinc-900: 2, hover:bg-zinc-800: 2 (Search, Bookmark 아이콘 버튼 2개)

TC-06: `grep -c 'ThemeToggle' src/components/header.tsx`
→ 0 (완전 제거됨)

TC-07: `npm run build`
→ ✓ Compiled successfully, 빌드 성공
