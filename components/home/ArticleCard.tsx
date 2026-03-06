import Image from 'next/image';
import Link from 'next/link';
import { formatDate, truncate, readingTime } from '@/lib/utils';
import type { PostWithRelations } from '@/lib/types';

interface ArticleCardProps {
  post: PostWithRelations;
  variant?: 'hero' | 'standard' | 'compact' | 'side';
}

function CategoryLabel({ name, slug }: { name: string; slug: string }) {
  return (
    <Link
      href={`/section/${slug}`}
      className="inline-block font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-dp-red hover:text-dp-text transition-colors"
    >
      {name}
    </Link>
  );
}

function AuthorMeta({ post }: { post: PostWithRelations }) {
  const date = post.publishedAt ?? post.createdAt;
  return (
    <div className="flex items-center gap-2 font-sans text-[11px] text-dp-text-muted mt-2">
      {post.author.name && (
        <>
          <span className="uppercase tracking-wide">By {post.author.name}</span>
          <span className="text-dp-border-light">·</span>
        </>
      )}
      <time dateTime={date.toISOString()}>{formatDate(date)}</time>
      <span className="text-dp-border-light">·</span>
      <span>{readingTime(post.content)}</span>
    </div>
  );
}

/* ── HERO: large image + big headline ──────────────────────── */
function HeroCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group">
      <CategoryLabel name={post.category.name} slug={post.category.slug} />

      <Link href={`/article/${post.slug}`} className="block mt-2">
        {post.heroImage && (
          <div className="relative w-full aspect-[16/9] overflow-hidden mb-4">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
              priority
            />
          </div>
        )}

        <h2 className="font-headline text-3xl md:text-4xl text-dp-text leading-[1.15] tracking-tight group-hover:underline decoration-1 underline-offset-4">
          {post.title}
        </h2>

        {post.excerpt && (
          <p className="font-body text-base text-dp-text-secondary leading-relaxed mt-3">
            {truncate(post.excerpt, 200)}
          </p>
        )}

        <AuthorMeta post={post} />
      </Link>
    </article>
  );
}

/* ── STANDARD: image + medium headline ─────────────────────── */
function StandardCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group">
      <CategoryLabel name={post.category.name} slug={post.category.slug} />

      <Link href={`/article/${post.slug}`} className="block mt-1.5">
        {post.heroImage && (
          <div className="relative w-full aspect-[4/3] overflow-hidden mb-3">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </div>
        )}

        <h3 className="font-headline text-xl text-dp-text leading-snug tracking-tight group-hover:underline decoration-1 underline-offset-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="font-body text-sm text-dp-text-secondary leading-relaxed mt-2">
            {truncate(post.excerpt, 120)}
          </p>
        )}

        <AuthorMeta post={post} />
      </Link>
    </article>
  );
}

/* ── COMPACT: text only, tight spacing ─────────────────────── */
function CompactCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group py-1">
      <CategoryLabel name={post.category.name} slug={post.category.slug} />

      <Link href={`/article/${post.slug}`} className="block mt-1">
        <h3 className="font-headline text-base text-dp-text leading-snug tracking-tight group-hover:underline decoration-1 underline-offset-2">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="font-body text-xs text-dp-text-muted leading-relaxed mt-1 line-clamp-2">
            {post.excerpt}
          </p>
        )}

        <AuthorMeta post={post} />
      </Link>
    </article>
  );
}

/* ── SIDE: horizontal thumbnail + compact text ─────────────── */
function SideCard({ post }: { post: PostWithRelations }) {
  return (
    <article className="group py-1">
      <Link href={`/article/${post.slug}`} className="flex gap-4">
        {post.heroImage && (
          <div className="relative w-24 h-20 flex-shrink-0 overflow-hidden">
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="96px"
              className="object-cover group-hover:scale-[1.02] transition-transform duration-700 ease-out"
            />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <span className="inline-block font-sans text-[11px] uppercase tracking-[0.15em] font-semibold text-dp-red">
            {post.category.name}
          </span>

          <h3 className="font-headline text-sm text-dp-text leading-snug tracking-tight group-hover:underline decoration-1 underline-offset-2 line-clamp-3 mt-0.5">
            {post.title}
          </h3>

          <div className="font-sans text-[11px] text-dp-text-muted mt-1">
            <time dateTime={(post.publishedAt ?? post.createdAt).toISOString()}>
              {formatDate(post.publishedAt ?? post.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
}

/* ── Switch ────────────────────────────────────────────────── */
export default function ArticleCard({ post, variant = 'standard' }: ArticleCardProps) {
  switch (variant) {
    case 'hero':
      return <HeroCard post={post} />;
    case 'compact':
      return <CompactCard post={post} />;
    case 'side':
      return <SideCard post={post} />;
    case 'standard':
    default:
      return <StandardCard post={post} />;
  }
}
