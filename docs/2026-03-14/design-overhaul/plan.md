# Stitch 5 디자인 대거 개편

## Context
stitch 5 HTML 목업 4개(home_feed, paper_detail, bookmarks, submit_paper) 기반으로 전체 UI 개편. 다크 모드 전용, Submit Paper 모달 포함.

---

## 변경 파일별 상세

### Phase 1: 테마 & 레이아웃 기반

#### `src/app/globals.css`
- **변경 이유**: 카테고리 색상 CSS 변수 추가 + 다크 테마를 zinc 스케일로 정렬
- **Before** (현재 코드):
```css
.dark {
  --background: oklch(0.15 0.01 270);
  --card: oklch(0.19 0.01 270);
  --border: oklch(1 0.005 270 / 12%);
  --muted-foreground: oklch(0.65 0.01 270);
}
```
- **After** (변경 후):
```css
@theme inline {
  /* 기존 변수 유지 + 추가 */
  --color-cat-prompting: #3b82f6;
  --color-cat-rag: #10b981;
  --color-cat-agent: #8b5cf6;
  --color-cat-finetuning: #f97316;
  --color-cat-eval: #ec4899;
  --color-cat-cost: #14b8a6;
  --color-cat-security: #ef4444;
  --color-highlight-bg: #451a03;
  --color-highlight-border: #b45309;
}

.dark {
  --background: oklch(0.07 0.005 270);    /* zinc-950 */
  --card: oklch(0.14 0.005 270);           /* zinc-900 */
  --border: oklch(0.21 0.005 270);         /* zinc-800 */
}
```
- **영향 범위**: 모든 컴포넌트의 색상 기반

#### `src/app/layout.tsx`
- **변경 이유**: 페이지별 max-width + 다크 모드 전용
- **Before**:
```tsx
<html lang="ko" suppressHydrationWarning>
  <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <Header />
      <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
    </ThemeProvider>
  </body>
</html>
```
- **After**:
```tsx
<html lang="ko" className="dark" suppressHydrationWarning>
  <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
    <Header />
    <main className="flex-1 flex flex-col items-center w-full">{children}</main>
  </body>
</html>
```
- **영향 범위**: 모든 페이지 레이아웃

#### `src/components/header.tsx`
- **변경 이유**: 아이콘 버튼 스타일 + 전체 폭 헤더
- **Before**:
```tsx
<header className="sticky top-0 z-50 bg-background/95 backdrop-blur">
  <div className="mx-auto max-w-3xl flex items-center justify-between px-4 py-3">
    <Link href="/">... paper.digest_</Link>
    <nav><Link>trends</Link> <Link>saved</Link> <ThemeToggle /></nav>
  </div>
</header>
```
- **After**:
```tsx
<header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm px-6 h-14 w-full">
  <Link href="/" className="font-mono text-sm font-medium tracking-tight">
    <span className="text-zinc-400">{'>'}</span> paper.digest_
  </Link>
  <div className="flex gap-2">
    <Link href="/bookmarks" className="flex items-center justify-center rounded-sm h-8 w-8 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition-colors">
      <Search size={16} />
    </Link>
    <Link href="/bookmarks" className="..."><Bookmark size={16} /></Link>
  </div>
</header>
```
- **영향 범위**: 모든 페이지 상단

---

### Phase 2: 홈 피드 & PaperCard

#### `src/components/source-tabs.tsx`
- **변경 이유**: 필 버튼 → 언더라인 탭, "전체" 탭 추가
- **Before**: Button 기반 2탭 (논문/커뮤니티)
- **After**: 언더라인 텍스트 3탭 (전체/논문/커뮤니티), border-b-2 active indicator
- **영향 범위**: page.tsx source 필터 로직 (all 조건 추가)

#### `src/components/category-chips.tsx` (신규)
- **용도**: 카테고리 필터 칩 (category-filter.tsx 대체)
- **핵심 코드**: 가로 스크롤 칩, 카테고리별 색상 bg/text/border

#### `src/components/paper-card.tsx`
- **변경 이유**: 전체 카드 스타일 개편
- **Before**: border-b 구분선, 평문 targetAudience/title/badges/authors
- **After**: bg-card, border-l-[3px] 카테고리색, [Category] 배지, title, line-clamp-2 설명, "For: audience" + "N% Match" 하단
- **영향 범위**: 홈피드, 북마크 (북마크는 Phase 4에서 테이블로 변경)

#### `src/app/page.tsx`
- **변경 이유**: 레이아웃 + 날짜 그룹 스타일 변경
- **Before**: max-w-3xl (layout), line dividers `── 오늘 · 5편 ──`
- **After**: max-w-[800px] 자체 지정, SourceTabs+CategoryChips 필터 섹션, dot indicator 날짜 그룹

---

### Phase 3: 논문 상세 페이지

#### `src/app/papers/[id]/page.tsx`
- **변경 이유**: 전체 UI 구조화
- **Before**: 기본 article, Badge/Link 나열, 평문 섹션
- **After**:
  - Breadcrumbs (Home / Category / Title)
  - Meta row (Calendar+date, Users+authors, FileText+PDF)
  - TL;DR 하이라이트 박스 (bg-highlight-bg, border-l-highlight-border, Zap icon)
  - Uppercase 섹션 헤더 + border-b
  - Code snippet + CopyButton
  - Terminology 2열 그리드
  - `<details>` 접이식 Abstract
- **영향 범위**: 논문 상세 뷰

#### `src/components/copy-button.tsx` (신규)
- **용도**: 코드 스니펫 클립보드 복사 + "Copied!" 피드백
- **핵심 코드**: `navigator.clipboard.writeText()` + 2초 상태 리셋

---

### Phase 4: 북마크 & Submit

#### `src/app/bookmarks/page.tsx`
- **변경 이유**: 카드 그리드 → 테이블 뷰
- **Before**: PaperCard 그리드 (grid sm:grid-cols-2 lg:grid-cols-3)
- **After**: max-w-[1024px], 필터 인풋, HTML table (Title/Category/Added/Rel%/Remove), 페이지네이션
- **영향 범위**: 북마크 페이지

#### `src/components/submit-paper-modal.tsx` (신규)
- **용도**: 커맨드 팔레트 스타일 논문 제출 모달
- **핵심 코드**: Portal overlay, arXiv URL 입력, ESC/Enter 힌트, POST /api/papers

#### `src/components/header.tsx` (Phase 4 업데이트)
- Submit 버튼 추가 + 모달 트리거 연결

---

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 에러 없음
- 추가: `npm run dev`로 각 페이지 (/, /papers/[id], /bookmarks) 수동 확인
