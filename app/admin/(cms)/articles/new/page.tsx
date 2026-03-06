import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getCategories } from '@/lib/actions/articles'
import ArticleForm from '@/components/cms/ArticleForm'

export const metadata: Metadata = { title: 'New Article' }

interface NewArticlePageProps {
  searchParams: Promise<{ section?: string }>
}

export default async function NewArticlePage({ searchParams }: NewArticlePageProps) {
  const { section } = await searchParams
  const [session, categories] = await Promise.all([auth(), getCategories()])
  if (!session?.user) redirect('/admin/login')

  // Find the pre-selected category from the ?section= query param
  const preselectedCategory = section
    ? categories.find((c) => c.slug === section)
    : undefined

  const sectionLabel = preselectedCategory?.name ?? 'story'

  return (
    <div className="space-y-6">
      <div className="border-b-2 border-dp-gold pb-4">
        <h1 className="font-headline text-4xl text-dp-text">New {preselectedCategory?.name ?? 'Article'}</h1>
        <p className="font-sans text-xs uppercase tracking-widest text-dp-text-secondary mt-1">
          Draft a new {sectionLabel.toLowerCase()} for publication
        </p>
      </div>

      <div className="bg-dp-elevated border border-dp-border p-6 md:p-8">
        <ArticleForm
          categories={categories}
          authorId={session.user.id}
          defaultCategoryId={preselectedCategory?.id}
        />
      </div>
    </div>
  )
}
