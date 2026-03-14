# Phase 3 - Step 3: newsletter-form.tsx 컴팩트 인라인 폼

## 변경 대상
- `src/components/newsletter-form.tsx`

## 테스트 기준

| TC | 항목 | 기대 결과 | 통과 |
|----|------|----------|------|
| TC-01 | 레이아웃 | border-t py-6 푸터 스타일 (기존 카드형 제거) | ✅ |
| TC-02 | 한 줄 배치 | 텍스트 + input + 버튼이 한 줄 flex | ✅ |
| TC-03 | 기능 유지 | fetch /api/newsletter, 성공/에러 메시지 동작 유지 | ✅ |
| TC-04 | 빌드 에러 | TypeScript 에러 없음 | ✅ |

## 실행출력

TC-01: newsletter-form.tsx 소스 확인
→ line 39: `<section className="border-t py-6">` — 기존 `rounded-lg border bg-card p-6 text-center` 제거 확인

TC-02: newsletter-form.tsx 소스 확인
→ line 40: `className="flex flex-col sm:flex-row items-center gap-3"` — 텍스트+input+버튼 한 줄 flex 배치 확인

TC-03: newsletter-form.tsx 소스 확인
→ handleSubmit 함수에서 `fetch('/api/newsletter', ...)` 호출 유지, success/error setMessage 로직 동일

TC-04: `npx tsc --noEmit --pretty`
→ 출력 없음 (에러 0건)
