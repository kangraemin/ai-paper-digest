# Phase 3: Core UI (핵심 화면)

## 목표
논문 목록, 상세, 검색, 북마크, RSS 등 핵심 사용자 인터페이스를 구현한다.

## 범위
- Root Layout + Header + 다크모드
- 홈 페이지 (오늘의 논문 목록, 카테고리 필터, 날짜 네비)
- 논문 카드/리스트 컴포넌트 + 핫 배지
- 논문 상세 페이지 + 북마크
- 검색 + RSS Feed API
- papers API Routes

## Steps

### Step 1: 레이아웃 + 홈 페이지
- layout.tsx, page.tsx, header.tsx
- paper-card.tsx, paper-list.tsx
- category-filter.tsx, date-nav.tsx, hot-badge.tsx
- /api/papers route
- 검증: npm run build 성공

### Step 2: 논문 상세 + 북마크
- papers/[id]/page.tsx, /api/papers/[id] route
- bookmark-button.tsx, use-bookmarks.ts hook
- bookmarks/page.tsx
- 검증: npm run build 성공

### Step 3: 검색 + RSS Feed
- search-bar.tsx, /api/search route
- /api/rss route (RSS 2.0 XML)
- queries.ts 검색 쿼리
- 검증: npm run build 성공
