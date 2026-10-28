'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import type { PostRow } from '@/db/schema';
import { isAdmin, startAdminSession, endAdminSession, verifyPassword } from '@/lib/books-admin';

const ADMIN = '/admin';

function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'post';
}

function parseList(value: FormDataEntryValue | null): string[] {
  return String(value ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
}

function normalizeType(value: FormDataEntryValue | null): 'blog' | 'essay' {
  return String(value ?? '') === 'essay' ? 'essay' : 'blog';
}

async function uniqueSlug(type: string, title: string, providedSlug: string): Promise<string> {
  const base = providedSlug ? slugify(providedSlug) : slugify(title);
  const db = getDb();
  let candidate = base;
  let n = 2;
  while (true) {
    const rows = await db
      .select({ id: schema.posts.id })
      .from(schema.posts)
      .where(and(eq(schema.posts.type, type), eq(schema.posts.slug, candidate)))
      .limit(1);
    if (rows.length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function parseForm(formData: FormData) {
  return {
    type: normalizeType(formData.get('type')),
    title: String(formData.get('title') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim() || null,
    tags: parseList(formData.get('tags')),
    authors: parseList(formData.get('authors')),
    heroImage: String(formData.get('heroImage') ?? '').trim() || null,
    date: String(formData.get('date') ?? '').trim() || null,
    comments: formData.get('comments') != null,
    content: String(formData.get('content') ?? ''),
  };
}

function requireAdmin() {
  if (!isAdmin()) redirect(`${ADMIN}/login`);
}

export async function adminLoginAction(formData: FormData): Promise<void> {
  if (!verifyPassword(String(formData.get('password') ?? ''))) {
    redirect(`${ADMIN}/login?error=1`);
  }
  startAdminSession();
  redirect(ADMIN);
}

export async function adminLogoutAction(): Promise<void> {
  endAdminSession();
  redirect('/');
}

export async function createPostAction(formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  if (!data.title) redirect(`${ADMIN}/posts/new?type=${data.type}&error=title`);

  const slug = await uniqueSlug(data.type, data.title, String(formData.get('slug') ?? ''));
  await getDb().insert(schema.posts).values({ ...data, slug });

  revalidatePath(data.type === 'blog' ? '/blog' : '/Insight');
  redirect(`${ADMIN}/posts?type=${data.type}`);
}

export async function updatePostAction(type: string, slug: string, formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  if (!data.title) redirect(`${ADMIN}/posts/edit/${type}/${encodeURIComponent(slug)}?error=title`);

  await getDb()
    .update(schema.posts)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(schema.posts.type, type), eq(schema.posts.slug, slug)));

  revalidatePath(type === 'blog' ? '/blog' : '/Insight');
  revalidatePath(type === 'blog' ? `/blog/${encodeURIComponent(slug)}` : `/Insight/${encodeURIComponent(slug)}`);
  redirect(`${ADMIN}/posts?type=${type}`);
}

export async function deletePostAction(type: string, slug: string): Promise<void> {
  requireAdmin();
  await getDb().delete(schema.posts).where(and(eq(schema.posts.type, type), eq(schema.posts.slug, slug)));
  revalidatePath(type === 'blog' ? '/blog' : '/Insight');
  redirect(`${ADMIN}/posts?type=${type}`);
}

export async function getPostRowForEdit(type: string, slug: string): Promise<PostRow | undefined> {
  const rows = await getDb()
    .select()
    .from(schema.posts)
    .where(and(eq(schema.posts.type, type), eq(schema.posts.slug, slug)))
    .limit(1);
  return rows[0];
}
