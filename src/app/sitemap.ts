import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { papers } from '@/lib/db/schema'
import { isNotNull, desc } from 'drizzle-orm'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = 'https://ai-paper-delta.vercel.app'

  const rows = await db
    .select({ id: papers.id, publishedAt: papers.publishedAt })
    .from(papers)
    .where(isNotNull(papers.summarizedAt))
    .orderBy(desc(papers.publishedAt))

  const paperUrls: MetadataRoute.Sitemap = rows.map((p) => ({
    url: `${BASE}/papers/${p.id}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: 'daily', priority: 1 },
    ...paperUrls,
  ]
}
