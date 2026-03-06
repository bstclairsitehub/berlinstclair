import type { Metadata } from 'next'
import Link from 'next/link'
import { auth } from '@/lib/auth'
import { getAllPosts, getCategories } from '@/lib/actions/articles'
import { formatDate } from '@/lib/utils'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function AdminDashboard() {
  const [session, posts, categories] = await Promise.all([
    auth(),
    getAllPosts(),
    getCategories(),
  ])

  // Group posts by category
  const postsByCategory = categories.map((cat) => ({
    category: cat,
    posts: posts.filter((p) => p.category.id === cat.id),
  }))

  const publishedCount = posts.filter((p) => p.published).length
  const draftCount = posts.filter((p) => !p.published).length

  return (
    <div className="space-y-10">
      {/* Welcome */}
      <div className="border-b-4 border-double border-dp-border-light pb-4">
        <p className="font-sans text-xs uppercase tracking-[0.3em] text-dp-text-muted mb-2">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
        <h1 className="font-headline text-4xl text-dp-text italic">
          Welcome back, {session?.user?.name ?? 'Editor'}
        </h1>
      </div>

      {/* Stats — newspaper column style */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-dp-border">
        {[
          { label: 'Total', value: posts.length },
          { label: 'Published', value: publishedCount },
          { label: 'Drafts', value: draftCount },
          { label: 'Sections', value: categories.length },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-3 text-center">
            <p className="font-headline text-3xl text-dp-text">{stat.value}</p>
            <p className="font-sans text-xs uppercase tracking-widest text-dp-text-muted mt-1">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* ── Section panels ── */}
      {postsByCategory.map(({ category, posts: catPosts }) => (
        <section key={category.id}>
          {/* Section headline — newspaper-style rule + title */}
          <div className="border-t-4 border-double border-dp-border-light pt-4 mb-4">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-headline text-3xl text-dp-text">{category.name}</h2>
              <div className="flex items-center gap-4">
                <span className="font-sans text-xs text-dp-text-muted uppercase tracking-widest">
                  {catPosts.length} {catPosts.length === 1 ? 'post' : 'posts'}
                </span>
                <Link
                  href={`/admin/articles/new?section=${category.slug}`}
                  className="font-sans text-xs uppercase tracking-widest border border-dp-border-light text-dp-text px-4 py-1.5 hover:border-dp-text transition-colors"
                >
                  + New Post
                </Link>
                <Link
                  href={`/section/${category.slug}`}
                  target="_blank"
                  className="font-sans text-xs uppercase tracking-widest text-dp-text-muted hover:text-dp-text transition-colors"
                >
                  View Section ↗
                </Link>
              </div>
            </div>
          </div>

          {/* Posts list */}
          {catPosts.length === 0 ? (
            <div className="border border-dp-border px-6 py-8 text-center">
              <p className="font-body text-sm italic text-dp-text-muted">No posts in this section yet.</p>
              <Link
                href={`/admin/articles/new?section=${category.slug}`}
                className="inline-block mt-3 font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text transition-colors"
              >
                Write your first {category.name.toLowerCase()} post →
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-dp-border border-t border-b border-dp-border">
              {catPosts.map((post) => (
                <div key={post.id} className="px-4 py-3 flex items-center justify-between gap-4 hover:bg-dp-surface transition-colors">
                  <div className="min-w-0">
                    <p className="font-headline text-base text-dp-text truncate">{post.title}</p>
                    <p className="font-sans text-xs text-dp-text-muted mt-0.5">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                      {post.excerpt && (
                        <span className="hidden md:inline"> — {post.excerpt.slice(0, 80)}…</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span
                      className={[
                        'font-sans text-xs uppercase tracking-widest',
                        post.published ? 'text-dp-green' : 'text-dp-text-muted',
                      ].join(' ')}
                    >
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                    <Link
                      href={`/admin/articles/${post.id}/edit`}
                      className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary hover:text-dp-text transition-colors"
                    >
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  )
}
