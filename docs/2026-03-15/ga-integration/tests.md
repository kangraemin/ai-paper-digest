# GA Integration TC

| TC | 검증 항목 | 기대 결과 | 상태 |
|----|----------|----------|------|
| TC-01 | `npm run build` 성공 | 빌드 에러 없음 | ✅ |
| TC-02 | layout.tsx에 GoogleAnalytics 컴포넌트 포함 | `gaId="G-6N6MYM10K5"` 포함된 컴포넌트 존재 | ✅ |
| TC-03 | @next/third-parties 패키지 설치 | package.json에 의존성 추가됨 | ✅ |

## 실행출력

TC-01: `npm run build`
→ 빌드 성공, 에러 없음. 전체 페이지 정상 렌더.

TC-02: `grep -n "GoogleAnalytics" src/app/layout.tsx`
→ import { GoogleAnalytics } from "@next/third-parties/google";
→ <GoogleAnalytics gaId="G-6N6MYM10K5" />

TC-03: `grep "@next/third-parties" package.json`
→ "@next/third-parties": "^14.2.29"
