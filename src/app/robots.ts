import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim()
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${BASE}/sitemap.xml`,
  }
}
