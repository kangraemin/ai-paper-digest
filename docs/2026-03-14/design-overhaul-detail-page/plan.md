# Phase 3 Step 1: 논문 상세 페이지 리디자인 + CopyButton

## 변경 파일별 상세

### `src/components/copy-button.tsx` (신규)
- **용도**: 코드 스니펫 복사 버튼 (클라이언트 컴포넌트)
- **핵심**: 'use client', clipboard API, Copy/Check 아이콘 토글, 2초 피드백

### `src/app/papers/[id]/page.tsx` (전면 리디자인)
- **변경 이유**: flat 레이아웃 → HTML 목업 기반 구조화 디자인
- **Before**: `<article className="space-y-6">` flat 섹션 나열
- **After**: 
  - max-w-[768px] 컨테이너
  - Breadcrumbs (Home / Category / Title)
  - Meta row (Calendar+date, Users+authors, FileText+PDF)
  - TL;DR highlight box (amber/highlight colors, Zap icon)
  - Uppercase section headers with border-b
  - Code snippet + CopyButton
  - Terminology 2-column grid
  - Collapsible abstract via `<details>`
- **유지**: 서버 컴포넌트, DB 쿼리, BookmarkButton, categoryColorMap 패턴

## 검증
- `npm run build` 성공
- Breadcrumbs, Meta row, TL;DR, Section headers, Code+CopyButton, Terminology grid, Collapsible abstract
