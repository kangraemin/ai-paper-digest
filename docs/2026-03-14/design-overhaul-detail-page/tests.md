| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | Breadcrumbs 렌더링 | Home / Category / Title 경로 표시 | ✅ |
| TC-02 | Meta row (Lucide icons) | Calendar+date, Users+authors, FileText+PDF 링크 | ✅ |
| TC-03 | TL;DR highlight box | highlight-bg/highlight-border 색상, Zap 아이콘 | ✅ |
| TC-04 | Section headers | uppercase + border-b 스타일 | ✅ |
| TC-05 | Code snippet + CopyButton | CopyButton 통합, clipboard copy + Copied! 피드백 | ✅ |
| TC-06 | Terminology 2-column grid | grid-cols-1 md:grid-cols-2 레이아웃 | ✅ |
| TC-07 | Collapsible Abstract | details/summary로 접기/펼치기 | ✅ |
| TC-08 | max-w-[768px] container | 컨테이너 최대 너비 제한 | ✅ |
| TC-09 | npm run build 성공 | 빌드 에러 없음 | ✅ |

## 실행출력

TC-01~08: 코드 리뷰로 확인 — page.tsx에 해당 JSX 구조가 올바르게 구현됨
- Breadcrumbs: `<nav>` with Home / Category / Title links
- Meta row: Calendar, Users, FileText Lucide icons with date, authors, PDF link
- TL;DR: `bg-highlight-bg/30 border-highlight-border` with Zap icon
- Section headers: `uppercase tracking-wide border-b border-zinc-800`
- Code: CopyButton imported and integrated in code snippet section
- Terminology: `grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4`
- Abstract: `<details className="group">` with ChevronDown rotation
- Container: `<article className="max-w-[768px] mx-auto">`

TC-09: `npm run build`
→ ✓ Compiled successfully in 2.4s
→ ✓ Generating static pages (11/11)
→ ƒ /papers/[id] 2.43 kB 120 kB — 빌드 성공, 에러 없음
