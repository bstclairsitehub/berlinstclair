import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts, deletePost, togglePublish } from '@/lib/actions/articles'
import { formatDate } from '@/lib/utils'
import DeleteButton from '@/components/cms/DeleteButton'

export const metadata: Metadata = { title: 'All Articles' }

export default async function AdminArticlesPage() {
  const posts = await getAllPosts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b-4 border-double border-dp-border-light pb-4">
        <h1 className="font-headline text-4xl text-dp-text">All Posts</h1>
        <Link
          href="/admin/articles/new"
          className="font-sans text-xs uppercase tracking-widest border border-dp-border-light text-dp-text px-5 py-2 hover:border-dp-text transition-colors"
        >
          + New Post
        </Link>
      </div>

      {/* Article list */}
      <div className="border-t border-b border-dp-border">
        {posts.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <p className="font-body text-lg italic text-dp-text-muted mb-4">No posts yet.</p>
            <Link
              href="/admin/articles/new"
              className="inline-block font-sans text-xs uppercase tracking-widest border border-dp-border-light text-dp-text px-5 py-2 hover:border-dp-text transition-colors"
            >
              Create First Post
            </Link>
          </div>
        ) : (
          <table className="w-full">
            <thead className="border-b border-dp-border bg-dp-surface">
              <tr>
                {['Headline', 'Section', 'Author', 'Date', 'Status', 'Actions'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left font-sans text-xs uppercase tracking-widest text-dp-text-secondary font-semibold"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-dp-border">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-dp-surface transition-colors">
                  <td className="px-4 py-3 max-w-xs">
                    <p className="font-headline text-sm text-dp-text truncate">
                      {post.title}
                    </p>
                    <p className="font-sans text-xs text-dp-text-secondary truncate mt-0.5">
                      /article/{post.slug}
                    </p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-xs uppercase tracking-wide text-dp-text-secondary">
                      {post.category.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-xs text-dp-text-secondary">
                      {post.author.name ?? 'Unknown'}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="font-sans text-xs text-dp-text-secondary">
                      {formatDate(post.publishedAt ?? post.createdAt)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={[
                        'font-sans text-xs uppercase tracking-widest px-2 py-0.5 border',
                        post.published
                          ? 'border-dp-green text-dp-green bg-green-900/20'
                          : 'border-dp-border text-dp-text-secondary',
                      ].join(' ')}
                    >
                      {post.published ? 'Live' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/admin/articles/${post.id}/edit`}
                        className="font-sans text-xs text-dp-blue hover:underline"
                      >
                        Edit
                      </Link>
                      <form
                        action={async () => {
                          'use server'
                          await togglePublish(post.id)
                        }}
                      >
                        <button
                          type="submit"
                          className="font-sans text-xs text-dp-text-secondary hover:text-dp-text transition-colors"
                        >
                          {post.published ? 'Unpublish' : 'Publish'}
                        </button>
                      </form>
                      {post.published && (
                        <Link
                          href={`/article/${post.slug}`}
                          target="_blank"
                          className="font-sans text-xs text-dp-text-secondary hover:text-dp-text transition-colors"
                        >
                          View ↗
                        </Link>
                      )}
                      <DeleteButton
                        action={async () => {
                          'use server'
                          await deletePost(post.id)
                        }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
