# TC: 북마크 테이블 뷰

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | max-w-[1024px] 컨테이너 | 페이지 최상위 div에 max-w-[1024px] 클래스 존재 | ✅ |
| TC-02 | 필터 입력 존재 | Search 아이콘 + input[placeholder="Filter bookmarks..."] 존재 | ✅ |
| TC-03 | HTML 테이블 구조 | table > thead > tr에 Title/Category/Added/Rel 컬럼 헤더 존재 | ✅ |
| TC-04 | Category 컬러 dot | categoryColorMap으로 dot 색상 적용, size-1.5 rounded-full 스타일 | ✅ |
| TC-05 | 페이지네이션 UI | PAGE_SIZE=10, Prev/Next 버튼 + "Showing X-Y of Z" 텍스트 | ✅ |
| TC-06 | npm run build 성공 | exit code 0 | ✅ |

## 실행출력

TC-01: grep 'max-w-\[1024px\]' src/app/bookmarks/page.tsx
→ `<div className="w-full max-w-[1024px] flex flex-col px-4 sm:px-6 py-8">` — 존재 확인

TC-02: grep 'Filter bookmarks' src/app/bookmarks/page.tsx
→ `placeholder="Filter bookmarks..."` + `<Search size={16}` — 존재 확인

TC-03: grep '<table\|Title\|Category\|Added\|Rel' src/app/bookmarks/page.tsx
→ `<table>`, `>Title<`, `>Category<`, `>Added<`, `>Rel<` 헤더 모두 존재

TC-04: grep 'categoryColorMap\|size-1.5 rounded-full' src/app/bookmarks/page.tsx
→ `categoryColorMap` 정의 + `size-1.5 rounded-full` dot 스타일 존재

TC-05: grep 'PAGE_SIZE\|Prev\|Next\|Showing' src/app/bookmarks/page.tsx
→ `PAGE_SIZE = 10`, `Prev`, `Next`, `Showing` 모두 존재

TC-06: npm run build
→ ✓ 빌드 성공, bookmarks 페이지 3 kB (109 kB First Load JS)
