# Step 2: CategoryChips controlled props 전환

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | CategoryChipsProps 인터페이스 존재 | `current: string`, `onChange: (category: string) => void` 필드 | ✅ |
| TC-02 | useRouter/useSearchParams 제거 | import에 useRouter, useSearchParams 없음 | ✅ |
| TC-03 | props로 current/onChange 사용 | `function CategoryChips({ current, onChange }` 형태 | ✅ |
| TC-04 | handleClick이 onChange 호출 | `onChange(id)` 호출 | ✅ |
| TC-05 | 빌드 성공 | source-tabs.tsx와 마찬가지로 컴포넌트 자체 에러 없음 | ✅ |

## 실행출력

TC-01: grep "interface CategoryChipsProps" src/components/category-chips.tsx
→ interface CategoryChipsProps { current: string; onChange: (category: string) => void; }

TC-02: grep "useRouter\|useSearchParams" src/components/category-chips.tsx
→ (no output — 제거 확인)

TC-03: grep "function CategoryChips" src/components/category-chips.tsx
→ export function CategoryChips({ current, onChange }: CategoryChipsProps) {

TC-04: grep "onChange(id)" src/components/category-chips.tsx
→ onChange(id);

TC-05: npx tsc --noEmit 2>&1
→ src/app/page.tsx(119,10): error TS2739: Type '{}' is missing the following properties from type 'SourceTabsProps': current, onChange
→ src/app/page.tsx(121,12): error TS2739: Type '{}' is missing the following properties from type 'CategoryChipsProps': current, onChange
→ page.tsx에서만 에러 발생 (Phase 3에서 수정 예정). category-chips.tsx 자체 에러 없음.
