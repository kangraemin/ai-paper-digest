# UI 소스 탭 분리: 논문 / 커뮤니티

## 변경 파일별 상세

### `src/components/source-tabs.tsx`
- **용도**: "논문" / "커뮤니티" 탭 전환 컴포넌트
- **핵심 코드**: category-filter.tsx 패턴 재사용, source 쿼리파라미터 제어

### `src/app/page.tsx`
- **변경 이유**: source 쿼리파라미터로 논문/커뮤니티 필터링
- **Before**: 모든 source를 한 피드에 표시
- **After**: source=community → hacker_news만, 기본 → arxiv/semantic_scholar만

### `src/components/paper-card.tsx`
- **변경 이유**: HN 소스 배지 표시
- **Before**: source prop 없음
- **After**: source prop 추가, hacker_news이면 HN 배지 렌더링

## 검증
- `npx tsc --noEmit` — 컴파일 에러 없음
- 탭 전환 시 소스별 필터링 동작 확인
