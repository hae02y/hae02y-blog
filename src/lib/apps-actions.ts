'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { isAdmin } from '@/lib/books-admin';

function requireAdmin() {
  if (!isAdmin()) redirect('/admin/login');
}

function parseUrl(value: FormDataEntryValue | null): string | null {
  try {
    const url = new URL(String(value ?? '').trim());
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

function parseForm(formData: FormData) {
  const order = Number(formData.get('sortOrder'));
  return {
    name: String(formData.get('name') ?? '').trim(),
    shortName: String(formData.get('shortName') ?? '').trim(),
    description: String(formData.get('description') ?? '').trim(),
    href: parseUrl(formData.get('href')),
    category: String(formData.get('category') ?? '').trim() || 'WEB APP',
    icon: String(formData.get('icon') ?? 'app').trim(),
    iconImage: parseUrl(formData.get('iconImage')),
    sortOrder: Number.isSafeInteger(order) ? order : 0,
    published: formData.get('published') === 'on',
  };
}

export async function createAppAction(formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  if (!data.name || !data.shortName || !data.href) redirect('/admin/apps/new?error=invalid');
  const existing = await getDb().select({ id: schema.apps.id }).from(schema.apps).where(eq(schema.apps.href, data.href)).limit(1);
  if (existing.length) redirect('/admin/apps/new?error=duplicate');
  await getDb().insert(schema.apps).values({ ...data, href: data.href });
  revalidatePath('/apps');
  revalidatePath('/admin/apps');
  redirect('/admin/apps');
}

export async function updateAppAction(id: number, formData: FormData): Promise<void> {
  requireAdmin();
  const data = parseForm(formData);
  const editPath = `/admin/apps/edit/${id}`;
  if (!data.name || !data.shortName || !data.href) redirect(`${editPath}?error=invalid`);
  const existing = await getDb().select({ id: schema.apps.id }).from(schema.apps).where(eq(schema.apps.href, data.href)).limit(1);
  if (existing.length && existing[0].id !== id) redirect(`${editPath}?error=duplicate`);
  await getDb().update(schema.apps).set({ ...data, href: data.href, updatedAt: new Date() }).where(eq(schema.apps.id, id));
  revalidatePath('/apps');
  revalidatePath('/admin/apps');
  redirect('/admin/apps');
}

export async function deleteAppAction(id: number): Promise<void> {
  requireAdmin();
  await getDb().delete(schema.apps).where(eq(schema.apps.id, id));
  revalidatePath('/apps');
  revalidatePath('/admin/apps');
  redirect('/admin/apps');
}
