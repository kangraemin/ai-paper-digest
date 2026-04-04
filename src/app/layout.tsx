import type { Metadata } from "next";
import { headers } from "next/headers";
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
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'AI Paper Digest',
  url: SITE_URL,
  description: 'Daily AI/LLM paper summaries. Latest arXiv papers summarized by Claude.',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/ko?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const lang = headerList.get('x-lang') || 'ko';
  return (
    <html lang={lang} suppressHydrationWarning>
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
