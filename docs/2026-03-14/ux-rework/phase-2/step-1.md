# Phase 2 - Step 1: globals.css 컬러 시스템 변경

## 변경 대상
- `src/app/globals.css`

## 테스트 기준

| TC | 항목 | 기대 결과 | 상태 |
|----|------|----------|------|
| TC-01 | Light background | oklch(0.995 0.002 80) 웜톤 배경 | ✅ |
| TC-02 | Light primary | oklch(0.25 0.03 270) 인디고 블랙 | ✅ |
| TC-03 | Dark background | oklch(0.15 0.01 270) 블루 틴트 다크 | ✅ |
| TC-04 | Dark card | oklch(0.19 0.01 270) | ✅ |
| TC-05 | CSS 문법 | 빌드 에러 없음 | ✅ |

## 실행출력

TC-01: --background = oklch(0.995 0.002 80) -> PASS
TC-02: --primary = oklch(0.25 0.03 270) -> PASS
TC-03: --background = oklch(0.15 0.01 270) -> PASS
TC-04: --card = oklch(0.19 0.01 270) -> PASS
TC-05: npx next lint → ✔ No ESLint warnings or errors
