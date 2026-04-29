import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { papers } from '@/lib/db/schema'
import { isNotNull, desc } from 'drizzle-orm'
import { TOPIC_SLUGS } from '@/lib/topics'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const BASE = (process.env.NEXT_PUBLIC_SITE_URL || 'https://paper-digest.app').trim()

  const rows = await db
    .select({ id: papers.id, publishedAt: papers.publishedAt, summarizedAt: papers.summarizedAt })
    .from(papers)
    .where(isNotNull(papers.summarizedAt))
    .orderBy(desc(papers.publishedAt))

  const latestDate = rows[0]
    ? new Date(rows[0].summarizedAt ?? rows[0].publishedAt)
    : new Date()

  const entries: MetadataRoute.Sitemap = [
    {
      url: `${BASE}/ko`,
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 1,
      alternates: {
        languages: {
          'ko-KR': `${BASE}/ko`,
          'en-US': `${BASE}/en`,
          'x-default': `${BASE}/en`,
        },
      },
    },
    {
      url: `${BASE}/ko/trends`,
      lastModified: latestDate,
      changeFrequency: 'daily',
      priority: 0.7,
      alternates: {
        languages: {
          'ko-KR': `${BASE}/ko/trends`,
          'en-US': `${BASE}/en/trends`,
          'x-default': `${BASE}/en/trends`,
        },
      },
    },
    ...TOPIC_SLUGS.map((slug) => ({
      url: `${BASE}/ko/topics/${slug}`,
      lastModified: latestDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
      alternates: {
        languages: {
          'ko-KR': `${BASE}/ko/topics/${slug}`,
          'en-US': `${BASE}/en/topics/${slug}`,
          'x-default': `${BASE}/en/topics/${slug}`,
        },
      },
    })),
    ...rows.map((p) => ({
      url: `${BASE}/ko/papers/${p.id}`,
      lastModified: new Date(p.summarizedAt ?? p.publishedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          'ko-KR': `${BASE}/ko/papers/${p.id}`,
          'en-US': `${BASE}/en/papers/${p.id}`,
          'x-default': `${BASE}/en/papers/${p.id}`,
        },
      },
    })),
  ]

  return entries
}
