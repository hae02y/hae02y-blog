import type { MetadataRoute } from 'next';
import { inArray } from 'drizzle-orm';
import { siteConfig } from '@/config/site';
import { getDb, schema } from '@/db';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getDb()
    .select({ type: schema.posts.type, slug: schema.posts.slug, updatedAt: schema.posts.updatedAt })
    .from(schema.posts)
    .where(inArray(schema.posts.type, ['blog', 'essay']));

  return [
    { url: `${siteConfig.url}/` },
    { url: `${siteConfig.url}/blog/` },
    { url: `${siteConfig.url}/about/` },
    { url: `${siteConfig.url}/en/about/` },
    { url: `${siteConfig.url}/Insight/` },
    ...posts.map(post => ({
      url: `${siteConfig.url}/${post.type === 'blog' ? 'blog' : 'Insight'}/${encodeURIComponent(post.slug)}/`,
      lastModified: post.updatedAt,
    })),
  ];
}
