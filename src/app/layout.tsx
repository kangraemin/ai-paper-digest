import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim();

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AI Paper Digest",
    template: "%s | AI Paper Digest",
  },
  description: "Daily AI/LLM paper summaries. Latest arXiv papers summarized by Claude.",
  openGraph: {
    title: "AI Paper Digest",
    description: "Daily AI/LLM paper summaries. Latest arXiv papers summarized by Claude.",
    url: SITE_URL,
    siteName: 'AI Paper Digest',
    type: "website",
    images: [{ url: '/opengraph-image', width: 1200, height: 630, alt: 'AI Paper Digest' }],
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
    description: 'Daily AI/LLM paper summaries. Latest arXiv papers summarized by Claude.',
    images: ['/opengraph-image'],
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Paper Digest',
  url: SITE_URL,
  description: 'Daily AI/LLM paper summaries. Latest arXiv papers summarized by Claude.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/en?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // headers()를 읽으면 모든 페이지가 매 요청 렌더로 바뀐다. 언어는 [lang] 레이아웃이 고친다
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
