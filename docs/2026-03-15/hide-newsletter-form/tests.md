# TC: 뉴스레터 폼 비활성화

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | 빌드 오류 없음 | `next build` 성공 | ✅ |
| TC-02 | 메인 페이지에 NewsletterForm 미렌더링 | page.tsx에서 import 및 컴포넌트 제거 확인 | ✅ |

## 실행출력

TC-01: `npx next build`
→ 빌드 성공 (오류 없음, static/dynamic 라우트 정상 생성)

TC-02: `grep -n "NewsletterForm" src/app/page.tsx`
→ 매칭 없음 (import 및 컴포넌트 모두 제거됨)
