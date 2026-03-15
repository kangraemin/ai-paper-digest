# GA 추가 (Google Analytics G-6N6MYM10K5)

## 변경 파일별 상세

### `src/app/layout.tsx`
- **변경 이유**: GA 스크립트를 모든 페이지에 삽입
- **Before**:
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header } from "@/components/header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body ...>
        <Header />
        <main ...>{children}</main>
      </body>
    </html>
  );
}
```
- **After**:
```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Header } from "@/components/header";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="dark" suppressHydrationWarning>
      <body ...>
        <Header />
        <main ...>{children}</main>
      </body>
      <GoogleAnalytics gaId="G-6N6MYM10K5" />
    </html>
  );
}
```
- **영향 범위**: 모든 페이지에 GA 스크립트 자동 삽입

## 패키지 설치
```bash
npm install @next/third-parties
```

## 검증
- `npm run build` 성공 확인
- layout.tsx에 GoogleAnalytics 컴포넌트 + gaId 확인
