# Step 1: PaperFeed 클라이언트 컴포넌트 생성

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | `src/components/paper-feed.tsx` 파일 존재 | 파일 존재 | ✅ |
| TC-02 | 'use client' 지시문 | 파일 첫 줄에 'use client' | ✅ |
| TC-03 | PaperFeedProps 인터페이스 | initialPapers: PaperListItem[], initialSource: string, initialCategory: string | ✅ |
| TC-04 | 상태 관리 | useState로 allPapers, source, category, page, hasMore, loading, loadingMore 관리 | ✅ |
| TC-05 | 필터 변경 시 fetch | useEffect에서 source/category 변경 시 /api/papers 호출 | ✅ |
| TC-06 | Load More 기능 | loadMore 콜백에서 다음 페이지 fetch + 기존 데이터에 append | ✅ |
| TC-07 | SourceTabs/CategoryChips에 controlled props 전달 | current, onChange props 전달 | ✅ |
| TC-08 | 날짜 그루핑 + devRelevance 정렬 | groupByDate 함수 + devRelevance 내림차순 정렬 | ✅ |
| TC-09 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 (page.tsx 에러 제외) | ✅ |

## 실행출력

TC-01: `ls src/components/paper-feed.tsx`
→ src/components/paper-feed.tsx (파일 존재 확인)

TC-02: `head -1 src/components/paper-feed.tsx`
→ 'use client'; (첫 줄에 'use client' 지시문 확인)

TC-03: `grep -A4 'interface PaperFeedProps' src/components/paper-feed.tsx`
→ interface PaperFeedProps {
  initialPapers: PaperListItem[];
  initialSource: string;
  initialCategory: string;
}

TC-04: `grep 'useState' src/components/paper-feed.tsx`
→ const [allPapers, setAllPapers] = useState(initialPapers);
  const [source, setSource] = useState(initialSource);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialPapers.length >= 20);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

TC-05: `grep -A2 'useEffect' src/components/paper-feed.tsx`
→ useEffect에서 source/category 의존성으로 /api/papers fetch 확인.
  isInitialRender ref로 초기 렌더 스킵, window.history.replaceState로 URL 동기화.

TC-06: `grep -A10 'const loadMore' src/components/paper-feed.tsx`
→ loadMore 콜백에서 nextPage = page + 1, fetch 후 setAllPapers(prev => [...prev, ...data.papers])로 append 확인.

TC-07: `grep -A1 'SourceTabs\|CategoryChips' src/components/paper-feed.tsx | grep -E 'current|onChange'`
→ <SourceTabs current={source} onChange={...} />
  <CategoryChips current={category} onChange={setCategory} />

TC-08: `grep -B1 -A3 'groupByDate\|devRelevance.*sort' src/components/paper-feed.tsx`
→ groupByDate 함수: publishedAt에서 날짜 추출 후 Record<string, PaperListItem[]> 그루핑.
  정렬: grouped[date].sort((a, b) => (b.devRelevance ?? 0) - (a.devRelevance ?? 0))

TC-09: `npx tsc --noEmit 2>&1`
→ src/app/page.tsx(119,10): error TS2739: Type '{}' is missing the following properties from type 'SourceTabsProps': current, onChange
  src/app/page.tsx(121,12): error TS2739: Type '{}' is missing the following properties from type 'CategoryChipsProps': current, onChange
  → paper-feed.tsx 자체 에러 0개. page.tsx 에러만 존재 (Step 2에서 수정 예정).

## 실행 결과

모든 TC 통과. paper-feed.tsx는 타입 에러 없이 정상 컴파일됨. page.tsx의 SourceTabs/CategoryChips props 에러는 Phase 3 Step 2에서 수정 예정.
