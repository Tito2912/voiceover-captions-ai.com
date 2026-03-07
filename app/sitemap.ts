import { getAllPosts } from '@/lib/content';
import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://voiceover-captions-ai.com';
  const posts = await getAllPosts();

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
    },
    ...posts.map((p) => ({
      url: `${baseUrl}/${p.slug}`,
      lastModified: new Date(p.updatedAt ?? p.date ?? new Date().toISOString()),
    })),
  ];
}
