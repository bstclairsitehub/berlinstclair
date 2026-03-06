import type { PostWithRelations } from '@/lib/types';

interface SchemaMarkupProps {
  post: PostWithRelations;
}

export default function SchemaMarkup({ post }: SchemaMarkupProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.excerpt,
    image: post.heroImage ? [post.heroImage] : [],
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.createdAt.toISOString(),
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'The Daily Gay',
      url: 'https://berlinstclair.com',
      logo: {
        '@type': 'ImageObject',
        url: 'https://berlinstclair.com/logo.png',
      },
    },
    articleSection: post.category.name,
    keywords: post.tags.map(({ tag }) => tag.name).join(', '),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://berlinstclair.com/article/${post.slug}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
