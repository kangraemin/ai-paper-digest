# Phase 3: Core UI (핵심 화면)

## 목표
Next.js App Router 기반으로 사이트 레이아웃, 헤더, 홈 페이지(논문 목록), 카테고리 필터, 날짜 네비게이션, 논문 상세, 북마크, 검색, RSS를 구현한다.

## 범위
- Root Layout (다크모드, 폰트, 메타데이터)
- Header 컴포넌트 + 네비게이션
- 홈 페이지 (논문 목록 그리드)
- Paper Card, Hot Badge, Category Filter, Date Nav 컴포넌트
- Papers API 엔드포인트
- Theme Toggle (다크모드)
- 논문 상세 페이지 + 북마크
- 검색 + RSS Feed

## Steps

### Step 1: 레이아웃 + 홈 페이지
- `src/components/theme-toggle.tsx` — 다크모드 토글 (next-themes)
- `src/components/header.tsx` — 사이트 헤더 + 네비게이션
- `src/app/layout.tsx` — Inter 폰트, ThemeProvider, Header
- `src/components/hot-badge.tsx` — 핫 논문 배지
- `src/components/paper-card.tsx` — 논문 카드
- `src/components/category-filter.tsx` — 카테고리 필터 탭
- `src/components/date-nav.tsx` — 날짜 네비게이션
- `src/app/api/papers/route.ts` — 논문 목록 GET API
- `src/app/page.tsx` — 홈 페이지 (Server Component)
- 검증: `npm run build` 성공

### Step 2: 논문 상세 + 북마크
- `src/app/papers/[id]/page.tsx` — 상세 페이지
- `src/app/api/papers/[id]/route.ts` — 상세 API
- `src/components/bookmark-button.tsx` — 북마크 버튼
- `src/hooks/use-bookmarks.ts` — localStorage CRUD
- `src/app/bookmarks/page.tsx` — 북마크 목록
- 검증: 상세 표시 + 북마크 추가/삭제/목록

### Step 3: 검색 + RSS Feed
- `src/components/search-bar.tsx` — 디바운스 검색바
- `src/app/api/search/route.ts` — LIKE 검색 API
- `src/app/api/rss/route.ts` — RSS 2.0 XML 피드
- `src/lib/db/queries.ts` — 검색 쿼리
- 검증: 키워드 검색 결과 + RSS XML 응답
