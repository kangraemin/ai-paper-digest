# Phase 2 / Step 1: 전체 빌드 검증

## 변경 파일
- `src/components/paper-card.tsx` — publishedAt unused warning 해소 (eslint-disable 주석)

## 테스트 케이스

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | tsc 통과 | `npx tsc --noEmit` 에러 0건 | ✅ |
| TC-02 | npm run build 성공 | `npm run build` exit code 0, 모든 route 생성 | ✅ |
| TC-03 | ESLint warning 해소 | publishedAt unused warning 제거 | ✅ |

## 실행출력

TC-01: `npx tsc --noEmit`
→ 출력 없음 (에러 0건) ✅

TC-02: `npm run build`
→ ✓ Compiled successfully in 2.3s
→ 11 routes 생성 (/, /bookmarks, /papers/[id] 등)
→ exit code 0 ✅

TC-03: `npm run build 2>&1 | grep -i warning`
→ 출력 없음 (warning 0건)
→ eslint-disable-next-line 주석 추가로 publishedAt unused warning 해소 ✅
