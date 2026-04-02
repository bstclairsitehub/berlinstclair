'use client';

import { useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { formatDate, truncate } from '@/lib/utils';
import type { PostWithRelations } from '@/lib/types';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface HorizontalScrollProps {
  posts: PostWithRelations[];
}

export default function HorizontalScroll({ posts }: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current || !trackRef.current) return;

      const panels = trackRef.current.querySelectorAll<HTMLElement>('.scroll-panel');
      if (panels.length === 0) return;

      gsap.to(trackRef.current, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: 1 / (panels.length - 1),
          start: 'top top',
          end: () => `+=${containerRef.current!.offsetWidth * (panels.length - 1)}`,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    },
    { scope: containerRef }
  );

  if (!posts || posts.length === 0) return null;

  return (
    <section className="w-full bg-dp-bg">
      {/* Section header - outside the pin container */}
      <div className="max-w-screen-xl mx-auto px-4 pt-10 pb-6 border-t border-dp-border scroll-reveal">
        <div className="flex items-center gap-4">
          <span className="font-sans text-xs uppercase tracking-[0.2em] font-semibold text-dp-gold whitespace-nowrap">
            Trending Stories
          </span>
          <div className="flex-1 border-t border-dp-border section-divider" />
          <span className="font-body text-xs text-dp-text-muted italic hidden sm:block">
            Scroll to explore
          </span>
        </div>
      </div>

      {/* Pin / horizontal scroll container */}
      <div
        ref={containerRef}
        className="relative overflow-hidden w-full h-screen"
        style={{ willChange: 'transform' }}
      >
        {/* Horizontal track */}
        <div
          ref={trackRef}
          className="flex h-full"
          style={{ width: `${posts.length * 100}vw` }}
        >
          {posts.map((post, index) => {
            const date = post.publishedAt ?? post.createdAt;
            return (
              <div
                key={post.id}
                className="scroll-panel relative flex-shrink-0 w-screen h-full overflow-hidden"
              >
                {/* Background image with dark overlay */}
                {post.heroImage ? (
                  <>
                    <Image
                      src={post.heroImage}
                      alt={post.title}
                      fill
                      sizes="100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
                  </>
                ) : (
                  <div className="absolute inset-0 bg-dp-bg" />
                )}

                {/* Panel number indicator */}
                <div className="absolute top-6 right-8 font-sans text-white/70 text-sm tracking-widest">
                  {String(index + 1).padStart(2, '0')} / {String(posts.length).padStart(2, '0')}
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 max-w-4xl">
                  {/* Category */}
                  <Link
                    href={`/section/${post.category.slug}`}
                    className="inline-block font-sans text-xs uppercase tracking-widest font-semibold text-dp-red hover:text-white transition-colors mb-3"
                  >
                    {post.category.name}
                  </Link>

                  {/* Headline */}
                  <Link href={`/article/${post.slug}`}>
                    <h2 className="font-headline text-3xl md:text-5xl lg:text-6xl text-white leading-tight tracking-tight mb-4 hover:underline decoration-1 underline-offset-4">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Excerpt */}
                  {post.excerpt && (
                    <p className="font-body text-lg text-white/80 leading-relaxed mb-4 max-w-2xl">
                      {truncate(post.excerpt, 160)}
                    </p>
                  )}

                  {/* Byline */}
                  <div className="flex items-center gap-3 font-sans text-xs text-white/75">
                    {post.author.name && (
                      <>
                        <span>By {post.author.name}</span>
                        <span className="text-white/70">|</span>
                      </>
                    )}
                    <time dateTime={date.toISOString()}>{formatDate(date)}</time>
                  </div>
                </div>

                {/* Scroll hint on first panel */}
                {index === 0 && (
                  <div className="absolute bottom-8 right-8 flex items-center gap-2 font-sans text-xs text-white/70 uppercase tracking-widest animate-pulse">
                    <span>Scroll</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
