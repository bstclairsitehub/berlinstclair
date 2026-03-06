import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getPostBySlug, getPublishedPosts } from '@/lib/actions/articles'
import ArticleMeta from '@/components/article/ArticleMeta'
import ArticleBody from '@/components/article/ArticleBody'
import PageFlipReader from '@/components/article/PageFlipReader'
import ArticleCard from '@/components/home/ArticleCard'
import SchemaMarkup from '@/components/ui/SchemaMarkup'

interface ArticlePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return { title: 'Article Not Found' }

  const canonicalUrl = `https://berlinstclair.com/article/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt ?? undefined,
    keywords: post.tags.map(({ tag }) => tag.name),
    openGraph: {
      title: post.title,
      description: post.excerpt ?? undefined,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt?.toISOString(),
      authors: post.author.name ? [post.author.name] : [],
      tags: post.tags.map(({ tag }) => tag.name),
      images: post.heroImage ? [{ url: post.heroImage, width: 1200, height: 630 }] : [],
      section: post.category.name,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt ?? undefined,
      images: post.heroImage ? [post.heroImage] : [],
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params
  const [post, relatedPosts] = await Promise.all([
    getPostBySlug(slug),
    getPublishedPosts({ limit: 4 }),
  ])

  if (!post) notFound()

  const related = relatedPosts.filter(
    (p) => p.slug !== post.slug && p.category.slug === post.category.slug
  ).slice(0, 3)

  // Prepare pages for the flip reader
  const flipPages = [{
    headline: post.title,
    body: post.excerpt ?? '',
    image: post.heroImage ?? undefined,
    category: post.category.name,
  }]

  return (
    <>
      <SchemaMarkup post={post} />

      <article className="max-w-screen-xl mx-auto px-4 py-8">
        {/* Hero image (full width above meta) */}
        {post.heroImage && (
          <div className="relative w-full aspect-[21/9] overflow-hidden mb-8 border border-dp-border">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article header / meta */}
        <div className="max-w-screen-md mx-auto">
          <ArticleMeta post={post} />
        </div>

        {/* Multi-column article body */}
        <div className="mt-8">
          <ArticleBody content={post.content} />
        </div>

        {/* 3D Page Flip Reader */}
        <div className="max-w-screen-md mx-auto">
          <PageFlipReader pages={flipPages} />
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="max-w-screen-md mx-auto mt-10 pt-6 border-t border-dp-border">
            <h3 className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary mb-3 font-semibold">
              Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.tags.map(({ tag }) => (
                <span
                  key={tag.id}
                  className="font-sans text-xs uppercase tracking-wide border border-dp-border px-3 py-1 text-dp-text-secondary"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* Related articles */}
      {related.length > 0 && (
        <section className="border-t-4 border-double border-dp-border-light mt-12">
          <div className="max-w-screen-xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="font-headline text-2xl text-dp-text whitespace-nowrap">
                More from {post.category.name}
              </h2>
              <div className="flex-1 border-t border-dp-border" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-dp-border">
              {related.map((p, i) => (
                <div key={p.id} className={i === 0 ? 'md:pr-6 pb-6 md:pb-0' : i === 1 ? 'md:px-6 py-6 md:py-0' : 'md:pl-6 pt-6 md:pt-0'}>
                  <ArticleCard post={p} variant="standard" />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
