# Phase 3 - Step 2: paper-card.tsx 리스트형 리워크

## 변경 대상
- `src/components/paper-card.tsx`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | Card 래퍼 제거 | Card/CardContent import 및 사용 제거, div로 대체 | ✅ |
| TC-02 | devNote 최상단 | devNote가 컴포넌트 최상단에 amber 색상으로 표시 | ✅ |
| TC-03 | 카테고리 스타일 | 반투명 배경 + 색상 텍스트 (예: bg-blue-500/15 text-blue-700) | ✅ |
| TC-04 | 새 카테고리 ID | prompting/rag/agent/fine-tuning/eval/cost-speed 스타일 매핑 | ✅ |
| TC-05 | 리스트형 레이아웃 | border-b, hover:bg-muted/30, 패딩 구조 | ✅ |
| TC-06 | 빌드 에러 | TypeScript 에러 없음 | ✅ |

## 실행 결과

TC-01: `grep -E 'Card|CardContent|Badge|HotBadge' src/components/paper-card.tsx`
→ Card/CardContent/Badge/HotBadge import 없음. PaperCard, PaperCardProps만 매칭 (컴포넌트 자체 이름).

TC-02: 파일 34-38행 확인
→ devNote가 div 내 최상단에 `text-amber-700 dark:text-amber-400`로 렌더링됨.

TC-03: CATEGORY_STYLES 객체 확인 (3-9행)
→ 각 카테고리에 `bg-*-500/15 text-*-700 dark:text-*-300` 패턴 적용됨.

TC-04: CATEGORY_STYLES 키 확인
→ prompting, rag, agent, fine-tuning, eval, cost-speed 6개 매핑 존재.

TC-05: div 래퍼 확인 (33행)
→ `py-4 border-b border-border hover:bg-muted/30 transition-colors` 적용됨.

TC-06: `npx tsc --noEmit`
→ 에러 없이 종료 (exit 0, 출력 없음).
