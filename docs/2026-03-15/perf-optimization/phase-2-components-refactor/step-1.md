# Step 1: SourceTabs controlled props 전환

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | SourceTabsProps 인터페이스 존재 | `current: string`, `onChange: (source: string) => void` 필드 | ✅ |
| TC-02 | useRouter/useSearchParams 제거 | import에 useRouter, useSearchParams 없음 | ✅ |
| TC-03 | props로 current/onChange 사용 | `function SourceTabs({ current, onChange }` 형태 | ✅ |
| TC-04 | handleClick이 onChange 호출 | `onChange(id)` 호출 | ✅ |
| TC-05 | 빌드 성공 | `npx tsc --noEmit` 에러 없음 | ✅ (source-tabs.tsx 자체 에러 없음, page.tsx에서 props 미전달 에러는 Phase 3에서 수정 예정) |

## 실행출력

TC-01: `grep 'interface SourceTabsProps' src/components/source-tabs.tsx`
→ `interface SourceTabsProps {` 확인. current: string, onChange: (source: string) => void 필드 존재.

TC-02: `grep 'useRouter\|useSearchParams' src/components/source-tabs.tsx`
→ 결과 없음 (제거 완료)

TC-03: `grep 'function SourceTabs' src/components/source-tabs.tsx`
→ `export function SourceTabs({ current, onChange }: SourceTabsProps)` 확인

TC-04: `grep 'onChange' src/components/source-tabs.tsx`
→ `const handleClick = (id: string) => { onChange(id); };` 확인

TC-05: `npx tsc --noEmit 2>&1`
→ `src/app/page.tsx(119,10): error TS2739: Type '{}' is missing the following properties from type 'SourceTabsProps': current, onChange`
→ source-tabs.tsx 자체에는 에러 없음. page.tsx 에러는 Phase 3 Step에서 props 전달 시 해결 예정.
