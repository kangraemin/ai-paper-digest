# Phase 3 - Step 1: header.tsx 터미널 스타일 리워크

## 변경 대상
- `src/components/header.tsx`

## TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | 로고 텍스트 | `> paper.digest_` 형태 (모노스페이스, animate-pulse 커서) | ✅ |
| TC-02 | sticky 헤더 | sticky top-0 z-50 + backdrop-blur 적용 | ✅ |
| TC-03 | 네비게이션 | font-mono, text-muted-foreground 스타일, Home 링크 제거 | ✅ |
| TC-04 | max-w | max-w-3xl 적용 (container 제거) | ✅ |
| TC-05 | 빌드 에러 | TypeScript 에러 없음 | ✅ |

## 실행출력

TC-01: `> paper.digest_` 로고 확인 — font-mono, animate-pulse 커서 포함
TC-02: `sticky top-0 z-50 bg-background/95 backdrop-blur` 확인
TC-03: trends/saved 링크에 font-mono text-muted-foreground 적용, Home 링크 제거됨
TC-04: `max-w-3xl` 적용, container 클래스 제거됨
TC-05: TypeScript 문법 정상
