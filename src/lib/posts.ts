import 'server-only';
import { and, eq, desc } from 'drizzle-orm';
import readingTime from 'reading-time';
import { getDb, schema } from '@/db';
import type { PostRow } from '@/db/schema';
import type { InsightPostMeta, DocPage } from '@/lib/docs';

// ───────────────────────── Blog ─────────────────────────

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  updatedAt: string;
  description: string;
  authors: string[];
  tags: string[];
  content: string;
  readingTime: number;
  comments?: boolean;
  image?: string;
};
export type BlogPostMeta = Omit<BlogPost, 'content'>;
export type BlogSearchDocument = Pick<BlogPost, 'slug' | 'title' | 'date' | 'description' | 'tags'> & {
  searchText: string;
};
export type BlogPostNavigation = { previous?: BlogPostMeta; next?: BlogPostMeta };

const POSTS_PER_PAGE = 10;

function rt(content: string): number {
  return Math.ceil(readingTime(content || '').minutes);
}

function rowToBlogPost(row: PostRow): BlogPost {
  return {
    slug: row.slug,
    title: row.title,
    date: row.date ?? '',
    updatedAt: row.updatedAt.toISOString(),
    description: row.description ?? '',
    authors: row.authors ?? [],
    tags: row.tags ?? [],
    content: row.content ?? '',
    readingTime: rt(row.content ?? ''),
    comments: row.comments,
    image: row.heroImage ?? undefined,
  };
}

function blogRows() {
  return getDb()
    .select()
    .from(schema.posts)
    .where(eq(schema.posts.type, 'blog'))
    .orderBy(desc(schema.posts.date));
}

export async function getAllPosts(): Promise<BlogPost[]> {
  return (await blogRows()).map(rowToBlogPost);
}

export async function getAllPostsMeta(): Promise<BlogPostMeta[]> {
  return (await getAllPosts()).map(({ content, ...meta }) => meta);
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
  const rows = await getDb()
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.type, 'blog'), eq(schema.posts.slug, slug)))
    .limit(1);
  return rows[0] ? rowToBlogPost(rows[0]) : undefined;
}

export async function getAdjacentPosts(slug: string): Promise<BlogPostNavigation> {
  const posts = await getAllPostsMeta();
  const index = posts.findIndex(p => p.slug === slug);
  if (index === -1) return {};
  return { previous: posts[index + 1], next: posts[index - 1] };
}

export async function getRelatedPosts(slug: string, limit = 3): Promise<BlogPostMeta[]> {
  const posts = await getAllPostsMeta();
  const current = posts.find(p => p.slug === slug);
  if (!current || current.tags.length === 0) return [];
  const currentTags = new Set(current.tags.map(t => t.toLowerCase()));
  return posts
    .filter(p => p.slug !== slug)
    .map(p => ({ p, overlap: p.tags.filter(t => currentTags.has(t.toLowerCase())).length }))
    .filter(x => x.overlap > 0)
    .sort((a, b) => (a.overlap !== b.overlap ? b.overlap - a.overlap : new Date(b.p.date).getTime() - new Date(a.p.date).getTime()))
    .slice(0, limit)
    .map(x => x.p);
}

export async function getPostsByTag(tag: string): Promise<BlogPostMeta[]> {
  return (await getAllPostsMeta()).filter(p => p.tags.some(t => t.toLowerCase() === tag.toLowerCase()));
}

export async function getAllTags(): Promise<{ label: string; count: number; permalink: string }[]> {
  const posts = await getAllPostsMeta();
  const map = new Map<string, number>();
  for (const post of posts) for (const tag of post.tags) map.set(tag, (map.get(tag) || 0) + 1);
  return Array.from(map.entries())
    .map(([label, count]) => ({ label, count, permalink: `/blog/tags/${encodeURIComponent(label)}` }))
    .sort((a, b) => b.count - a.count);
}

export async function getPaginatedPosts(page: number): Promise<{ posts: BlogPostMeta[]; totalPages: number; currentPage: number }> {
  const all = await getAllPostsMeta();
  const totalPages = Math.ceil(all.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  return { posts: all.slice(start, start + POSTS_PER_PAGE), totalPages, currentPage: page };
}

function markdownToSearchText(content: string): string {
  return content
    .replace(/^```[^\n]*$/gm, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function getBlogSearchDocuments(): Promise<BlogSearchDocument[]> {
  return (await getAllPosts()).map(post => ({
    slug: post.slug,
    title: post.title,
    date: post.date,
    description: post.description,
    tags: post.tags,
    searchText: markdownToSearchText(post.content),
  }));
}

// ───────────────────────── Essay (Insight) ─────────────────────────

function rowToInsightMeta(row: PostRow): InsightPostMeta {
  const meta: InsightPostMeta = {
    slug: [row.slug],
    href: `/Insight/${encodeURIComponent(row.slug)}`,
    title: row.title,
    description: row.description || '천천히 곱씹어 볼 생각의 기록입니다.',
    tags: row.tags ?? [],
    readingTime: rt(row.content ?? ''),
  };
  if (row.date) meta.date = row.date;
  if (row.heroImage) meta.heroImage = row.heroImage;
  return meta;
}

export async function getAllInsightPosts(): Promise<InsightPostMeta[]> {
  const rows = await getDb().select().from(schema.posts).where(eq(schema.posts.type, 'essay'));
  return rows.map(rowToInsightMeta).sort((a, b) => {
    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title, 'ko');
  });
}

export async function getInsightPage(slug: string[]): Promise<DocPage | undefined> {
  const key = Array.isArray(slug) ? slug.join('/') : String(slug);
  const rows = await getDb()
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.type, 'essay'), eq(schema.posts.slug, key)))
    .limit(1);
  const row = rows[0];
  if (!row) return undefined;
  const page: DocPage = {
    slug: [row.slug],
    title: row.title,
    content: row.content ?? '',
    description: row.description || undefined,
    tags: row.tags ?? [],
    heroImage: row.heroImage || undefined,
  };
  if (row.date) page.date = row.date;
  return page;
}
