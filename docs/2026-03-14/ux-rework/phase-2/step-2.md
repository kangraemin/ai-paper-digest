# Phase 2 - Step 2: layout.tsx 폰트 + 레이아웃 변경

## 변경 대상
- `src/app/layout.tsx`

## 테스트 기준

| TC | 항목 | 기대 결과 | 상태 |
|----|------|----------|------|
| TC-01 | JetBrains Mono import | JetBrains_Mono가 next/font/google에서 import됨 | ✅ |
| TC-02 | font variable | --font-mono CSS variable 설정됨 | ✅ |
| TC-03 | body className | inter.variable + mono.variable 모두 포함 | ✅ |
| TC-04 | max-w | max-w-5xl → max-w-3xl 변경됨 | ✅ |
| TC-05 | 빌드 에러 | TypeScript/빌드 에러 없음 | ✅ |

## 실행출력

TC-01: `import { Inter, JetBrains_Mono } from "next/font/google"` 확인
TC-02: `const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" })` 확인
TC-03: `className={`${inter.variable} ${mono.variable} font-sans antialiased`}` 확인
TC-04: `max-w-3xl` 확인 (기존 max-w-5xl에서 변경)
TC-05: 코드 문법 정상
