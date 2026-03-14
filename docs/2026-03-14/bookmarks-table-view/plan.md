# 북마크 페이지 테이블 뷰 전환

## 변경 파일별 상세

### `src/app/bookmarks/page.tsx`
- **변경 이유**: 카드 그리드 레이아웃을 테이블 뷰로 전환하여 북마크 목록의 정보 밀도를 높이고 스캔 효율 개선
- **Before** (현재 코드):
```tsx
// Card grid 레이아웃, PaperCard 컴포넌트 사용
// 필터/페이지네이션 없음
// useBookmarks에서 bookmarks만 사용
<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
  {papers.map(paper => (
    <PaperCard key={paper.id} {...paper} />
  ))}
</div>
```
- **After** (변경 후):
```tsx
// 테이블 뷰로 전환
// - max-w-[1024px] 컨테이너
// - Bookmark 아이콘 + 제목 + 카운트 헤더
// - Search 필터 입력
// - HTML table: Title / Category / Added / Rel / Remove 컬럼
// - Category 컬럼에 colored dot + 이름
// - Remove 버튼 hover 시 표시 (BookmarkMinus)
// - 10개 단위 페이지네이션 (Prev/Next)
// - 반응형: sm에서 Added 숨김, md에서 Rel 숨김
// - useBookmarks에서 toggle 함수 사용하여 북마크 제거
// - PaperCard import 제거, lucide-react에서 아이콘 import
```
- **영향 범위**: 북마크 페이지만 변경. PaperCard 컴포넌트는 수정하지 않음.

## 핵심 변경 포인트
1. `PaperCard` import 제거 → `lucide-react` 아이콘 + `next/link` import
2. `useBookmarks()`에서 `toggle` 디스트럭처링 추가
3. `filter` (검색), `page` (페이지네이션) state 추가
4. 카드 그리드 → HTML `<table>` 전환
5. `categoryColorMap` / `categoryDisplayName` 인라인 정의 (paper-card.tsx와 동일)

## 검증
- 검증 명령어: `npm run build`
- 기대 결과: 빌드 성공 (exit code 0)
