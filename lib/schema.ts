import type { Post } from '@/lib/types';

const BASE_URL = 'https://voiceover-captions-ai.com';

const STATIC_PAGE_SLUGS = new Set([
  'legal-notice', 'privacy-policy', 'contact', 'about', 'methodology', 'sources',
]);

export function buildArticleJsonLd(post: Post) {
  const url = new URL(post.canonical ?? `/${post.slug}`, BASE_URL).toString();
  const published = post.date ?? post.updatedAt ?? new Date().toISOString();
  const modified = post.updatedAt ?? published;

  if (STATIC_PAGE_SLUGS.has(post.slug)) {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: post.title,
      description: post.description,
      url,
      dateModified: modified,
    };
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    mainEntityOfPage: url,
    datePublished: published,
    dateModified: modified,
    author: [{ '@type': 'Person', name: 'Tony Caron' }],
    publisher: { '@type': 'Organization', name: 'Voiceover Captions AI' },
  };
}

export function buildBreadcrumbJsonLd(post: Post) {
  const url = new URL(post.canonical ?? `/${post.slug}`, BASE_URL).toString();
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: BASE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: url,
      },
    ],
  };
}
