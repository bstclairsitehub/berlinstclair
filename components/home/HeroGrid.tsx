import Image from 'next/image';
import Link from 'next/link';
import ArticleCard from '@/components/home/ArticleCard';
import { formatDate, truncate, readingTime } from '@/lib/utils';
import type { PostWithRelations } from '@/lib/types';
import type { CategoryWithCount } from '@/lib/types';

interface HeroGridProps {
  posts: PostWithRelations[];
  categories: CategoryWithCount[];
}

/* ── Section Label ─────────────────────────────────────────── */
function SectionLabel({ title, href }: { title: string; href: string }) {
  return (
    <div className="flex items-center gap-4 mb-6 scroll-reveal">
      <Link
        href={href}
        className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-dp-gold hover:text-dp-text transition-colors duration-300 whitespace-nowrap"
      >
        {title}
      </Link>
      <div className="flex-1 border-t border-dp-border section-divider" />
    </div>
  );
}

/* ── Full-width Featured Hero ──────────────────────────────── */
function FeaturedHero({ post }: { post: PostWithRelations }) {
  const date = post.publishedAt ?? post.createdAt;

  return (
    <section className="relative w-full">
      {/* Image container */}
      <div className="relative w-full aspect-[16/7] md:aspect-[21/9] overflow-hidden">
        {post.heroImage ? (
          <>
            <Image
              src={post.heroImage}
              alt={post.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dp-bg via-dp-bg/50 to-transparent" />
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-t from-dp-bg via-dp-surface to-dp-elevated" />
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 lg:p-16">
          <div className="max-w-screen-xl mx-auto">
            {/* Category */}
            <Link
              href={`/section/${post.category.slug}`}
              className="inline-block font-sans text-xs uppercase tracking-[0.2em] font-semibold text-dp-red hover:text-dp-text transition-colors mb-3 hero-entrance"
            >
              {post.category.name}
            </Link>

            {/* Headline */}
            <Link href={`/article/${post.slug}`} className="block group">
              <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl text-dp-text leading-[1.1] tracking-tight mb-4 group-hover:underline decoration-1 underline-offset-4 max-w-4xl hero-entrance-delay-1">
                {post.title}
              </h2>
            </Link>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="font-body text-base md:text-lg text-dp-text-secondary leading-relaxed mb-4 max-w-2xl hero-entrance-delay-2">
                {truncate(post.excerpt, 180)}
              </p>
            )}

            {/* Byline */}
            <div className="flex items-center gap-3 font-sans text-xs text-dp-text-muted hero-entrance-delay-1">
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
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── Main Export ────────────────────────────────────────────── */
export default function HeroGrid({ posts, categories }: HeroGridProps) {
  if (!posts || posts.length === 0) return null;

  const heroPost = posts[0];
  const remaining = posts.slice(1);

  // Group remaining posts by category
  const categoryMap: Record<string, PostWithRelations[]> = {};
  remaining.forEach((post) => {
    const slug = post.category.slug;
    if (!categoryMap[slug]) categoryMap[slug] = [];
    categoryMap[slug].push(post);
  });

  // Define section order
  const sectionOrder = ['gay-storytime', 'fashion', 'music'];
  const sectionLabels: Record<string, string> = {
    'gay-storytime': 'Gay Storytime',
    fashion: 'Fashion',
    music: 'Music I\'m Listening To',
  };

  // Collect posts that don't fit named sections
  const uncategorized: PostWithRelations[] = [];
  Object.keys(categoryMap).forEach((slug) => {
    if (!sectionOrder.includes(slug)) {
      uncategorized.push(...categoryMap[slug]);
    }
  });

  return (
    <div className="w-full bg-dp-bg">
      {/* ── Featured Hero ──────────────────────────────── */}
      <FeaturedHero post={heroPost} />

      {/* ── Section Blocks ─────────────────────────────── */}
      <div className="max-w-screen-xl mx-auto px-4">
        {sectionOrder.map((slug, sectionIndex) => {
          const sectionPosts = categoryMap[slug];
          if (!sectionPosts || sectionPosts.length === 0) return null;

          // Alternate layout per section for visual variety
          const isEven = sectionIndex % 2 === 0;

          return (
            <section
              key={slug}
              className={`py-10 md:py-14 border-t border-dp-border scroll-reveal ${
                isEven ? 'bg-dp-elevated/40' : ''
              }`}
            >
              <SectionLabel
                title={sectionLabels[slug] || slug}
                href={`/section/${slug}`}
              />

              {sectionPosts.length === 1 ? (
                /* Single post — wide card */
                <ArticleCard post={sectionPosts[0]} variant="standard" />
              ) : sectionPosts.length === 2 ? (
                /* Two posts — side by side */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y md:divide-y-0 md:divide-x divide-dp-border">
                  <div className="pb-6 md:pb-0 md:pr-8">
                    <ArticleCard post={sectionPosts[0]} variant="standard" />
                  </div>
                  <div className="pt-6 md:pt-0 md:pl-8">
                    <ArticleCard post={sectionPosts[1]} variant="standard" />
                  </div>
                </div>
              ) : (
                /* Three+ posts — feature + sidebar */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
                  {/* Lead story takes 2 cols */}
                  <div
                    className={`lg:col-span-2 pb-8 lg:pb-0 border-b lg:border-b-0 border-dp-border ${
                      isEven
                        ? 'lg:border-r lg:pr-8'
                        : 'lg:border-l lg:pl-8 lg:order-2'
                    }`}
                  >
                    <ArticleCard post={sectionPosts[0]} variant="hero" />
                  </div>

                  {/* Remaining stories stacked */}
                  <div
                    className={`pt-8 lg:pt-0 flex flex-col divide-y divide-dp-border ${
                      isEven ? 'lg:pl-8' : 'lg:pr-8 lg:order-1'
                    }`}
                  >
                    {sectionPosts.slice(1, 4).map((post) => (
                      <div key={post.id} className="py-4 first:pt-0 last:pb-0">
                        <ArticleCard post={post} variant="compact" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}

        {/* ── Uncategorized / overflow posts ────────────── */}
        {uncategorized.length > 0 && (
          <section className="py-10 md:py-14 border-t border-dp-border scroll-reveal bg-dp-elevated/40">
            <SectionLabel title="More Stories" href="/" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 divide-dp-border">
              {uncategorized.slice(0, 6).map((post, index) => (
                <div
                  key={post.id}
                  className={[
                    'py-6 first:pt-0 md:py-0',
                    index % 3 !== 0 ? 'lg:border-l lg:pl-6' : '',
                    index % 3 !== 2 ? 'lg:pr-6' : '',
                    index > 0 && index % 2 !== 0 ? 'md:border-l md:pl-6 lg:border-l-0 lg:pl-0' : '',
                    index % 2 === 0 ? 'md:pr-6 lg:pr-0' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <ArticleCard post={post} variant="compact" />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
