import type { Metadata } from 'next'
import HeroGrid from '@/components/home/HeroGrid'
import HorizontalScroll from '@/components/home/HorizontalScroll'
import HomeTagline from '@/components/home/HomeTagline'
import ScrollRevealClient from '@/components/home/ScrollRevealClient'
import { getPublishedPosts, getCategories } from '@/lib/actions/articles'

export const metadata: Metadata = {
  title: 'The Daily Gay — Culture, Style & Stories',
  description:
    'A celebration of queer joy, pride, and the fabulous everyday. Explore fashion, music, and authentic stories from the LGBTQ+ community on The Daily Gay.',
}

export default async function HomePage() {
  const [posts, categories] = await Promise.all([
    getPublishedPosts({ limit: 20 }),
    getCategories(),
  ])

  // Hero gets the latest post; the rest feed into section blocks
  const scrollPosts = posts.slice(0, Math.min(posts.length, 5))

  return (
    <div className="w-full">
      {/* Tagline bar */}
      <HomeTagline />

      {/* Featured hero + section-based editorial grid */}
      <HeroGrid posts={posts} categories={categories} />

      {/* Horizontal scroll "Trending" section */}
      {scrollPosts.length >= 2 && (
        <HorizontalScroll posts={scrollPosts} />
      )}

      {/* Terminal rule */}
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="border-t border-dp-border-light mt-4 mb-2" />
        <div className="border-t border-dp-border" />
      </div>

      {/* Initialize scroll reveal observer */}
      <ScrollRevealClient />
    </div>
  )
}
