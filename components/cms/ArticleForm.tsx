'use client';

import { useState, useTransition, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/cms/TiptapEditor';
import ImageUpload from '@/components/cms/ImageUpload';
import { createPost, updatePost } from '@/lib/actions/articles';
import type { PostWithRelations, CategoryWithCount } from '@/lib/types';

// Utility: convert a title string into a URL-safe slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Hard-coded tag options — swap for fetched tags as needed
const AVAILABLE_TAGS = [
  { id: 'tag-feature', name: 'Feature', slug: 'feature' },
  { id: 'tag-personal', name: 'Personal', slug: 'personal' },
  { id: 'tag-style', name: 'Style', slug: 'style' },
  { id: 'tag-playlist', name: 'Playlist', slug: 'playlist' },
  { id: 'tag-lookbook', name: 'Lookbook', slug: 'lookbook' },
  { id: 'tag-essay', name: 'Essay', slug: 'essay' },
  { id: 'tag-review', name: 'Review', slug: 'review' },
  { id: 'tag-guide', name: 'Guide', slug: 'guide' },
];

interface ArticleFormProps {
  initialData?: PostWithRelations;
  categories: CategoryWithCount[];
  authorId: string;
  defaultCategoryId?: string;
}

export default function ArticleForm({ initialData, categories, authorId, defaultCategoryId }: ArticleFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState(initialData?.title ?? '');
  const [slug, setSlug] = useState(initialData?.slug ?? '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt ?? '');
  const [content, setContent] = useState<any>(initialData?.content ?? null);
  const [heroImage, setHeroImage] = useState(initialData?.heroImage ?? '');
  const [categoryId, setCategoryId] = useState(
    initialData?.category.id ?? defaultCategoryId ?? categories[0]?.id ?? ''
  );
  const [published, setPublished] = useState(initialData?.published ?? false);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>(
    initialData?.tags.map((t) => t.tag.id) ?? []
  );

  // Auto-slug from title unless the user manually edits the slug field
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(!!initialData);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value;
      setTitle(newTitle);
      if (!slugManuallyEdited) {
        setSlug(generateSlug(newTitle));
      }
    },
    [slugManuallyEdited]
  );

  const handleTagToggle = (tagId: string) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  async function handleSubmit(e: React.FormEvent, publishOverride?: boolean) {
    e.preventDefault();
    if (!title.trim()) { setError('Headline is required.'); return; }
    if (!slug.trim()) { setError('Slug is required.'); return; }
    if (!categoryId) { setError('Section (category) is required.'); return; }

    const finalPublished = publishOverride !== undefined ? publishOverride : published;

    setError(null);
    setSuccessMessage(null);

    startTransition(async () => {
      try {
        const payload = {
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          heroImage: heroImage || undefined,
          categoryId,
          published: finalPublished,
          tagIds: selectedTagIds,
        };

        if (initialData) {
          await updatePost(initialData.id, payload);
        } else {
          await createPost({ ...payload, authorId });
        }

        router.push('/admin/articles');
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Error banner */}
      {error && (
        <div className="border-l-4 border-dp-red bg-red-900/20 px-4 py-3">
          <p className="font-sans text-sm text-dp-red">{error}</p>
        </div>
      )}

      {/* Success banner */}
      {successMessage && (
        <div className="border-l-4 border-dp-green bg-green-900/20 px-4 py-3">
          <p className="font-sans text-sm text-dp-green">{successMessage}</p>
        </div>
      )}

      {/* ── Headline ── */}
      <div className="space-y-2">
        <label
          htmlFor="article-title"
          className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold"
        >
          Headline <span className="text-dp-red">*</span>
        </label>
        <input
          id="article-title"
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter article headline..."
          required
          className="w-full border-b-2 border-dp-border focus:border-dp-text outline-none font-headline text-3xl text-dp-text py-2 placeholder:text-dp-text-muted bg-transparent transition-colors"
        />
      </div>

      {/* ── Slug ── */}
      <div className="space-y-2">
        <label
          htmlFor="article-slug"
          className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold"
        >
          URL Slug <span className="text-dp-red">*</span>
        </label>
        <div className="flex items-center gap-2 border border-dp-border focus-within:border-dp-text transition-colors">
          <span className="font-sans text-sm text-dp-text-muted pl-3 select-none whitespace-nowrap">
            /article/
          </span>
          <input
            id="article-slug"
            type="text"
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugManuallyEdited(true);
            }}
            required
            placeholder="my-article-slug"
            className="flex-1 py-2 pr-3 font-sans text-sm focus:outline-none bg-transparent text-dp-text"
          />
        </div>
        <p className="font-sans text-xs text-dp-text-muted">
          Auto-generated from headline. Edit to customise the URL.
        </p>
      </div>

      {/* ── Section (category) ── */}
      <div className="space-y-2">
        <label
          htmlFor="article-category"
          className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold"
        >
          Section <span className="text-dp-red">*</span>
        </label>
        <select
          id="article-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
          className="border border-dp-border px-3 py-2 font-sans text-sm focus:outline-none focus:border-dp-text bg-dp-surface text-dp-text transition-colors"
        >
          <option value="">Select a section...</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* ── Excerpt / Deck ── */}
      <div className="space-y-2">
        <label
          htmlFor="article-excerpt"
          className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold"
        >
          Deck / Excerpt
        </label>
        <textarea
          id="article-excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={3}
          placeholder="A compelling summary displayed beneath the headline and on article cards..."
          className="w-full border border-dp-border px-3 py-2 font-body text-sm italic focus:outline-none focus:border-dp-text resize-none transition-colors bg-dp-surface text-dp-text"
        />
      </div>

      {/* ── Hero Image ── */}
      <div className="space-y-2">
        <label className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold">
          Hero Image
        </label>
        <ImageUpload value={heroImage || undefined} onChange={setHeroImage} />
      </div>

      {/* ── Body Content ── */}
      <div className="space-y-2">
        <label className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold">
          Body Content
        </label>
        <TiptapEditor content={content} onChange={setContent} />
      </div>

      {/* ── Tags ── */}
      <div className="space-y-3">
        <label className="block font-sans text-xs uppercase tracking-widest text-dp-text-muted font-semibold">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {AVAILABLE_TAGS.map((tag) => {
            const checked = selectedTagIds.includes(tag.id);
            return (
              <label
                key={tag.id}
                className={[
                  'flex items-center gap-1.5 cursor-pointer border px-3 py-1.5 font-sans text-xs uppercase tracking-widest transition-colors',
                  checked
                    ? 'bg-dp-text text-dp-bg border-dp-text'
                    : 'bg-dp-surface text-dp-text-secondary border-dp-border hover:border-dp-text',
                ].join(' ')}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={checked}
                  onChange={() => handleTagToggle(tag.id)}
                />
                {tag.name}
              </label>
            );
          })}
        </div>
      </div>

      {/* ── Publish Toggle ── */}
      <div className="border border-dp-border p-4 flex items-center justify-between bg-dp-surface">
        <div>
          <p className="font-sans text-sm font-semibold text-dp-text">
            {published ? 'Published' : 'Draft'}
          </p>
          <p className="font-sans text-xs text-dp-text-muted mt-0.5">
            {published
              ? 'This article is live and visible to readers.'
              : 'This article is saved as a draft and not publicly visible.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPublished((prev) => !prev)}
          role="switch"
          aria-checked={published}
          className={[
            'relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-dp-gold focus:ring-offset-2',
            published ? 'bg-dp-text' : 'bg-dp-text-muted',
          ].join(' ')}
        >
          <span
            className={[
              'inline-block h-4 w-4 transform rounded-full bg-dp-bg transition-transform',
              published ? 'translate-x-6' : 'translate-x-1',
            ].join(' ')}
          />
        </button>
      </div>

      {/* ── Form Actions ── */}
      <div className="flex items-center justify-between border-t border-dp-border pt-6 gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="font-sans text-xs uppercase tracking-widest text-dp-text-muted hover:text-dp-text transition-colors"
        >
          Cancel
        </button>

        <div className="flex items-center gap-3">
          {/* Save draft (always saves as unpublished) */}
          {!initialData && (
            <button
              type="button"
              disabled={isPending}
              onClick={(e) => handleSubmit(e as any, false)}
              className="font-sans text-xs uppercase tracking-widest border border-dp-border px-5 py-2.5 text-dp-text hover:border-dp-text transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Draft
            </button>
          )}

          {/* Primary submit — respects `published` toggle state */}
          <button
            type="submit"
            disabled={isPending}
            className="font-sans text-sm uppercase tracking-widest bg-dp-gold text-dp-bg px-8 py-2.5 hover:bg-dp-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending
              ? 'Saving...'
              : initialData
              ? published
                ? 'Update & Publish'
                : 'Update Draft'
              : published
              ? 'Publish Now'
              : 'Save Article'}
          </button>
        </div>
      </div>
    </form>
  );
}
