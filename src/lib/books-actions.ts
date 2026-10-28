'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import type { BookRow } from '@/db/schema';
import { isAdmin, startAdminSession, endAdminSession, verifyPassword } from '@/lib/books-admin';

const ADMIN_PATH = '/Insight/books/admin';

function slugify(title: string): string {
  const base = title
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return base || 'book';
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const db = getDb();
  let candidate = base;
  let n = 2;
  // Keep probing until the slug is free.
  while (true) {
    const existing = await db
      .select({ id: schema.books.id })
      .from(schema.books)
      .where(eq(schema.books.slug, candidate))
      .limit(1);
    if (existing.length === 0) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function parseForm(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const author = String(formData.get('author') ?? '').trim();
  const cover = String(formData.get('cover') ?? '').trim();
  const link = String(formData.get('link') ?? '').trim();
  const readDate = String(formData.get('readDate') ?? '').trim();
  const status = String(formData.get('status') ?? 'finished').trim() === 'reading' ? 'reading' : 'finished';
  const description = String(formData.get('description') ?? '').trim();
  const content = String(formData.get('content') ?? '');
  const ratingRaw = String(formData.get('rating') ?? '').trim();
  const ratingNum = Number(ratingRaw);
  const rating = ratingRaw && Number.isFinite(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? Math.round(ratingNum) : null;

  return {
    title,
    author: author || null,
    cover: cover || null,
    link: link || null,
    readDate: readDate || null,
    status,
    description: description || null,
    content,
    rating,
  };
}

function requireAdmin() {
  if (!isAdmin()) redirect(`${ADMIN_PATH}/login`);
}

export async function loginAction(formData: FormData): Promise<void> {
  const password = String(formData.get('password') ?? '');
  if (!verifyPassword(password)) {
    redirect(`${ADMIN_PATH}/login?error=1`);
  }
  startAdminSession();
  redirect(ADMIN_PATH);
}

export async function logoutAction(): Promise<void> {
  endAdminSession();
  redirect('/Insight/books/');
}

export async function createBookAction(formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  if (!data.title) redirect(`${ADMIN_PATH}/new?error=title`);

  const slug = await uniqueSlug(data.title);
  await getDb().insert(schema.books).values({ ...data, slug });

  revalidatePath('/Insight/books');
  redirect(ADMIN_PATH);
}

export async function updateBookAction(slug: string, formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  if (!data.title) redirect(`${ADMIN_PATH}/edit/${encodeURIComponent(slug)}?error=title`);

  await getDb()
    .update(schema.books)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(schema.books.slug, slug));

  revalidatePath('/Insight/books');
  revalidatePath(`/Insight/books/${encodeURIComponent(slug)}`);
  redirect(ADMIN_PATH);
}

export async function deleteBookAction(slug: string): Promise<void> {
  requireAdmin();
  await getDb().delete(schema.books).where(eq(schema.books.slug, slug));
  revalidatePath('/Insight/books');
  redirect(ADMIN_PATH);
}

export async function getBookRowForEdit(slug: string): Promise<BookRow | undefined> {
  const rows = await getDb().select().from(schema.books).where(eq(schema.books.slug, slug)).limit(1);
  return rows[0];
}
