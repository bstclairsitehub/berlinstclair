import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getAllPosts, getCategories } from '@/lib/actions/articles'
import ArticleForm from '@/components/cms/ArticleForm'

interface EditArticlePageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: EditArticlePageProps): Promise<Metadata> {
  const { id } = await params
  const posts = await getAllPosts()
  const post = posts.find((p) => p.id === id)
  return { title: post ? `Edit: ${post.title}` : 'Edit Article' }
}

export default async function EditArticlePage({ params }: EditArticlePageProps) {
  const { id } = await params
  const [session, posts, categories] = await Promise.all([
    auth(),
    getAllPosts(),
    getCategories(),
  ])

  if (!session?.user) redirect('/admin/login')

  const post = posts.find((p) => p.id === id)
  if (!post) notFound()

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-dp-border pb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl text-dp-text">Edit Article</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary mt-1 truncate max-w-lg">
            {post.title}
          </p>
        </div>
        {post.published && (
          <a
            href={`/article/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 font-sans text-xs uppercase tracking-widest border border-dp-border px-4 py-2 hover:border-dp-gold transition-colors text-dp-text-secondary hover:text-dp-text"
          >
            View Live ↗
          </a>
        )}
      </div>

      <div className="bg-dp-elevated border border-dp-border p-6 md:p-8">
        <ArticleForm
          initialData={post}
          categories={categories}
          authorId={session.user.id}
        />
      </div>
    </div>
  )
}
