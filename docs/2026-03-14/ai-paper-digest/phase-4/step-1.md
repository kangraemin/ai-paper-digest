# Phase 4 - Step 1: 핫 논문 하이라이트

## 목표
홈 페이지 상단에 핫 논문 섹션을 추가한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | 핫 논문 섹션 | page.tsx에 isHot 논문 별도 표시 | ✅ |
| TC-02 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 실행 결과

TC-01: page.tsx에 HotPapers 컴포넌트 추가 (isHot=true 논문 상위 5개)
TC-02: `npm run build` → 빌드 성공
