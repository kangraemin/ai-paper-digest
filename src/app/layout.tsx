import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'),
  title: {
    default: "AI Paper Digest",
    template: "%s | AI Paper Digest",
  },
  description: "매일 업데이트되는 AI/LLM 논문 한글 요약. arXiv 최신 논문을 Claude가 요약합니다.",
  openGraph: {
    title: "AI Paper Digest",
    description: "매일 업데이트되는 AI/LLM 논문 한글 요약",
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app',
    siteName: 'AI Paper Digest',
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: '0UASLKq0AblFh-moSdGr8iXj6vzkBqHzqRtQsiFiamA',
  },
  other: {
    'naver-site-verification': '2e4d659c76c39edf9217174dfc71064db3d4809a',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Paper Digest',
    description: '매일 업데이트되는 AI/LLM 논문 한글 요약',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Paper Digest',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app',
  description: '매일 업데이트되는 AI/LLM 논문 한글 요약. arXiv 최신 논문을 Claude가 요약합니다.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app'}/ko?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${inter.variable} ${mono.variable} font-sans antialiased bg-background text-foreground min-h-screen flex flex-col`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
      <GoogleAnalytics gaId="G-6N6MYM10K5" />
    </html>
  );
}
