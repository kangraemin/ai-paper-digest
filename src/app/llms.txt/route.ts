const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim()

export const dynamic = 'force-static'

export function GET() {
  const body = `# AI Paper Digest

> Daily summaries of AI/LLM papers from arXiv, Hugging Face, Hacker News and Reddit, written by Claude. Available in English and Korean.

## Main pages
- [Latest papers (English)](${BASE}/en): newest summarized papers
- [Latest papers (Korean)](${BASE}/ko): same feed in Korean
- [Trends](${BASE}/en/trends): topic trends across recent papers
- [Categories](${BASE}/en/categories): papers by category

## Data
- [Sitemap](${BASE}/sitemap.xml)
- [RSS feed](${BASE}/api/rss?lang=en)

Each paper page (${BASE}/en/papers/<id>) has a one-line summary, key points, source link and related papers.
`
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
