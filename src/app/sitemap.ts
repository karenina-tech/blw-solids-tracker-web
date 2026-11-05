import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/config/site';
import { getAllPosts } from '@/lib/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();

  const home: MetadataRoute.Sitemap[number] = {
    url: SITE_URL,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 1,
  };

  if (posts.length === 0) return [home];

  return [
    home,
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(`${posts[0].updated ?? posts[0].date}T00:00:00Z`),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(`${post.updated ?? post.date}T00:00:00Z`),
      changeFrequency: 'yearly' as const,
      priority: 0.7,
    })),
  ];
}
