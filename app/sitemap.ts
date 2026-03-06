import { MetadataRoute } from 'next'
import { getPublishedPosts, getCategories } from '@/lib/actions/articles'

const BASE_URL = 'https://berlinstclair.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    getPublishedPosts(),
    getCategories(),
  ])

  const postUrls = posts.map((post) => ({
    url: `${BASE_URL}/article/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  const sectionUrls = categories.map((cat) => ({
    url: `${BASE_URL}/section/${cat.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.7,
  }))

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    ...sectionUrls,
    ...postUrls,
  ]
}
