import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPublishedPosts, getCategories } from '@/lib/actions/articles'
import ArticleCard from '@/components/home/ArticleCard'
import LookbookGrid from '@/components/fashion/LookbookGrid'
import SpotifyEmbed from '@/components/music/SpotifyEmbed'
import TrackList from '@/components/music/TrackList'

interface SectionPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: SectionPageProps): Promise<Metadata> {
  const { category } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === category)
  if (!cat) return { title: 'Section Not Found' }

  const canonicalUrl = `https://berlinstclair.com/section/${cat.slug}`
  const sectionDescriptions: Record<string, string> = {
    'gay-storytime': 'Discover authentic gay stories, personal narratives, and community experiences on The Daily Gay.',
    'fashion': 'Explore queer fashion, style tips, and LGBTQ+ fashion trends on The Daily Gay.',
    'music': 'Listen to curated music playlists and read about artists from the LGBTQ+ community on The Daily Gay.',
  }

  const description = sectionDescriptions[category] || `Explore ${cat.name} articles on The Daily Gay.`

  return {
    title: `${cat.name} | The Daily Gay`,
    description: description,
    keywords: [cat.name.toLowerCase(), 'LGBTQ+', 'queer lifestyle', 'gay culture'],
    openGraph: {
      title: `${cat.name} | The Daily Gay`,
      description: description,
      type: 'website',
      url: canonicalUrl,
      siteName: 'The Daily Gay',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${cat.name} | The Daily Gay`,
      description: description,
    },
    alternates: {
      canonical: canonicalUrl,
    },
  }
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { category } = await params
  const categories = await getCategories()
  const cat = categories.find((c) => c.slug === category)
  if (!cat) notFound()

  const posts = await getPublishedPosts({ categorySlug: category })

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8">
      {/* Section header */}
      <div className="border-b-2 border-dp-gold pb-4 mb-8">
        <h1 className="font-headline text-5xl text-dp-text">{cat.name}</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary mt-1">
          {posts.length} {posts.length === 1 ? 'article' : 'articles'}
        </p>
      </div>

      {/* Category-specific layouts */}
      {category === 'fashion' ? (
        <FashionLayout posts={posts} />
      ) : category === 'music' ? (
        <MusicLayout posts={posts} />
      ) : (
        <DefaultLayout posts={posts} />
      )}
    </div>
  )
}

/* ── Fashion: Lookbook grid with product cards ── */
function FashionLayout({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="space-y-12">
      {/* Featured lookbook */}
      <LookbookGrid />

      {/* Articles as editorial features */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-sans text-xs uppercase tracking-widest text-dp-gold font-semibold">
            Style Stories
          </h2>
          <div className="h-px flex-1 ml-4 bg-dp-border" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {posts.map((post) => (
            <ArticleCard key={post.id} post={post} variant="standard" />
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Music: Spotify embed + tracklist + articles ── */
function MusicLayout({ posts }: { posts: any[] }) {
  return (
    <div className="space-y-12">
      {/* Spotify player */}
      <SpotifyEmbed />

      {/* Tracklist */}
      <TrackList />

      {/* Articles */}
      {posts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sans text-xs uppercase tracking-widest text-dp-gold font-semibold">
              Liner Notes
            </h2>
            <div className="h-px flex-1 ml-4 bg-dp-border" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} variant="standard" />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Default: Editorial grid (Gay Storytime, etc.) ── */
function DefaultLayout({ posts }: { posts: any[] }) {
  if (posts.length === 0) {
    return <EmptyState />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0">
      {/* First article: hero */}
      <div className="md:col-span-2 lg:col-span-2 md:border-r md:border-dp-border md:pr-6 pb-6 md:pb-0">
        <ArticleCard post={posts[0]} variant="hero" />
      </div>

      {/* Second article */}
      {posts[1] && (
        <div className="md:pl-6 pt-6 md:pt-0">
          <ArticleCard post={posts[1]} variant="standard" />
        </div>
      )}

      {/* Remaining articles */}
      {posts.slice(2).length > 0 && (
        <div className="md:col-span-2 lg:col-span-3 border-t border-dp-border mt-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-dp-border">
            {posts.slice(2).map((post, i) => (
              <div
                key={post.id}
                className={[
                  'pt-4 md:pt-0',
                  i > 0 ? 'md:pl-6' : '',
                ].join(' ')}
              >
                <ArticleCard post={post} variant="compact" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <p className="font-body text-lg text-dp-text-secondary">
      No articles in this section yet.
    </p>
  )
}
