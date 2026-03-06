import Link from 'next/link';
import { formatDate, readingTime } from '@/lib/utils';
import type { PostWithRelations } from '@/lib/types';

interface ArticleMetaProps {
  post: PostWithRelations;
}

export default function ArticleMeta({ post }: ArticleMetaProps) {
  const publishDate = post.publishedAt ?? post.createdAt;
  const minutes = readingTime(post.content);

  return (
    <header className="mb-8">
      {/* Category label */}
      <div className="mb-3">
        <Link
          href={`/section/${post.category.slug}`}
          className="inline-block font-sans text-xs uppercase tracking-widest font-semibold text-dp-red hover:text-dp-text transition-colors border-b border-dp-red hover:border-dp-text pb-0.5"
        >
          {post.category.name}
        </Link>
      </div>

      {/* Headline */}
      <h1 className="font-headline text-4xl md:text-5xl lg:text-6xl text-dp-text leading-tight tracking-tight mb-4">
        {post.title}
      </h1>

      {/* Deck / subheading (excerpt as subhead) */}
      {post.excerpt && (
        <p className="font-body text-xl text-dp-text-secondary italic leading-relaxed mb-6 max-w-2xl">
          {post.excerpt}
        </p>
      )}

      {/* Byline and metadata row */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
        {/* Left: Author + date */}
        <div className="space-y-1">
          {post.author.name && (
            <p className="font-sans text-sm font-bold text-dp-text tracking-wide">
              By{' '}
              <span className="hover:underline cursor-pointer">{post.author.name}</span>
            </p>
          )}
          <div className="flex items-center gap-3 font-sans text-xs text-dp-text-muted">
            <time dateTime={publishDate.toISOString()} className="tracking-wide">
              {formatDate(publishDate)}
            </time>
            <span className="text-dp-border">|</span>
            <span>{minutes} min read</span>
          </div>
        </div>

        {/* Right: Social share hint */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Share article"
            className="flex items-center gap-1.5 font-sans text-xs uppercase tracking-widest text-dp-text-muted hover:text-dp-text transition-colors border border-dp-border px-3 py-1.5 hover:border-dp-border"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
            Share
          </button>
        </div>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map(({ tag }) => (
            <Link
              key={tag.id}
              href={`/tag/${tag.slug}`}
              className="inline-block font-sans text-xs uppercase tracking-widest text-dp-text-muted hover:text-dp-text transition-colors border border-dp-border hover:border-dp-border px-2 py-0.5"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      )}

      {/* Horizontal rule */}
      <hr className="border-t-2 border-dp-border-light mt-4" />
    </header>
  );
}
