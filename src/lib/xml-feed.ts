import 'server-only';
import { desc, eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';

export function escapeXml(value: string): string {
  return value.replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[character] || character);
}

export async function getRecentBlogFeedPosts() {
  return getDb()
    .select({
      slug: schema.posts.slug,
      title: schema.posts.title,
      description: schema.posts.description,
      date: schema.posts.date,
      tags: schema.posts.tags,
      createdAt: schema.posts.createdAt,
      updatedAt: schema.posts.updatedAt,
    })
    .from(schema.posts)
    .where(eq(schema.posts.type, 'blog'))
    .orderBy(desc(schema.posts.date), desc(schema.posts.createdAt))
    .limit(20);
}
