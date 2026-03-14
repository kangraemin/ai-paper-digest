# Phase 5 - Step 1: UI 폴리시 + 배포 준비

## 목표
SEO 메타태그, 로딩 상태, 에러 페이지를 추가한다.

## TC (Test Cases)

| # | 검증 항목 | 검증 방법 | 결과 |
|---|----------|----------|------|
| TC-01 | SEO 메타태그 | layout.tsx에 OG 메타데이터 설정 | ✅ |
| TC-02 | 로딩 상태 | loading.tsx 파일 존재 | ✅ |
| TC-03 | 에러 상태 | error.tsx 또는 not-found.tsx 존재 | ✅ |
| TC-04 | 빌드 성공 | npm run build 에러 없음 | ✅ |

## 실행 결과

TC-01: layout.tsx에 openGraph, robots 메타데이터 추가
TC-02: loading.tsx 생성 (스피너 + 로딩 텍스트)
TC-03: not-found.tsx 생성 (404 페이지 + 홈 버튼)
TC-04: `npm run build` → 빌드 성공 (10개 route)
