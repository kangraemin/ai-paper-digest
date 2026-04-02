import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { papers } from '@/lib/db/schema'
import { isNotNull, desc } from 'drizzle-orm'
import { SUPPORTED_LANGS } from '@/lib/i18n'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim()

  const rows = await db
    .select({ id: papers.id, publishedAt: papers.publishedAt, summarizedAt: papers.summarizedAt })
    .from(papers)
    .where(isNotNull(papers.summarizedAt))
    .orderBy(desc(papers.publishedAt))

  const entries: MetadataRoute.Sitemap = []
  const latestDate = rows[0]
    ? new Date(rows[0].summarizedAt ?? rows[0].publishedAt)
    : new Date()

  for (const lang of SUPPORTED_LANGS) {
    entries.push({
      url: `${BASE}/${lang}`,
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 1,
    })
    entries.push({
      url: `${BASE}/${lang}/trends`,
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 0.7,
    })
    for (const p of rows) {
      entries.push({
        url: `${BASE}/${lang}/papers/${p.id}`,
        lastModified: new Date(p.summarizedAt ?? p.publishedAt),
        changeFrequency: 'monthly',
        priority: 0.8,
      })
    }
  }

  return entries
}
