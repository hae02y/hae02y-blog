import { notFound, redirect } from 'next/navigation';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import AppForm from '@/components/admin/AppForm';
import { updateAppAction } from '@/lib/apps-actions';
import { isAdmin } from '@/lib/books-admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: '앱 수정', robots: { index: false } };

export default async function EditAppPage({ params, searchParams }: { params: { id: string }, searchParams: { error?: string } }) {
  if (!isAdmin()) redirect('/admin/login');
  const id = Number(params.id);
  if (!Number.isSafeInteger(id) || id < 1) notFound();
  const [app] = await getDb().select().from(schema.apps).where(eq(schema.apps.id, id)).limit(1);
  if (!app) notFound();
  return <main className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16"><h1 className="text-2xl font-semibold text-black dark:text-white">앱 수정</h1><AppForm action={updateAppAction.bind(null, id)} defaults={app} submitLabel="변경 저장" error={searchParams?.error} /></main>;
}
