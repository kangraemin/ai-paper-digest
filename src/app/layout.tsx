import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Header } from "@/components/header";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: {
    default: "AI Paper Digest",
    template: "%s | AI Paper Digest",
  },
  description: "매일 업데이트되는 AI/LLM 논문 한글 요약. arXiv 최신 논문을 Claude가 요약합니다.",
  openGraph: {
    title: "AI Paper Digest",
    description: "매일 업데이트되는 AI/LLM 논문 한글 요약",
    type: "website",
    locale: "ko_KR",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Header />
          <main className="mx-auto max-w-3xl px-4 py-6">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
