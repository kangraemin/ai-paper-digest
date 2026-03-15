# Step 1: Email Template

## 변경 파일
- `src/lib/email/templates.ts` (신규)

## TC

| ID | 테스트 항목 | 검증 방법 | 기대 결과 | 통과 |
|------|-----------|----------|----------|------|
| TC-1 | renderDailyDigest 함수 export | 코드 확인 | named export 존재 | ✅ |
| TC-2 | 테이블 기반 레이아웃 | HTML 구조 확인 | max-width: 600px 테이블 레이아웃 | ✅ |
| TC-3 | 인라인 CSS | HTML 확인 | style 속성 인라인 사용 | ✅ |
| TC-4 | 섹션 구성 | HTML 확인 | 헤더(날짜), 핫 논문, 개발자 추천, 카테고리 요약, 푸터 포함 | ✅ |
| TC-5 | unsubscribe 링크 | 푸터 확인 | unsubscribeUrl 링크 포함 | ✅ |
| TC-6 | 타입 정의 | 코드 확인 | DigestData, PaperSummary 인터페이스 정의 | ✅ |
| TC-7 | 빌드 성공 | `npm run build` | 에러 없음 | ✅ |

## 실행출력

TC-1: grep 'export function renderDailyDigest' src/lib/email/templates.ts
→ export function renderDailyDigest(data: DigestData): string {

TC-2: grep 'max-width: 600px' src/lib/email/templates.ts
→ max-width: 600px; width: 100%; — 테이블 기반 레이아웃 확인

TC-3: 코드 확인 — 모든 스타일이 style="" 인라인으로 적용됨

TC-4: 코드 확인 — hotSection(🔥 핫 논문), devSection(💡 개발자 추천), categorySection(📊 카테고리별 현황), footer(구독 해지) 포함

TC-5: grep 'unsubscribeUrl' src/lib/email/templates.ts
→ <a href="${unsubscribeUrl}" style="...">구독 해지</a>

TC-6: grep 'export interface' src/lib/email/templates.ts
→ DigestData, PaperSummary 인터페이스 정의

TC-7: npm run build
→ ✓ Compiled successfully.
