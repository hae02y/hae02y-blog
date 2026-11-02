import { redirect } from 'next/navigation';
import AppForm from '@/components/admin/AppForm';
import { createAppAction } from '@/lib/apps-actions';
import { isAdmin } from '@/lib/books-admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: '새 앱', robots: { index: false } };

export default function NewAppPage({ searchParams }: { searchParams: { error?: string } }) {
  if (!isAdmin()) redirect('/admin/login');
  return <main className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16"><h1 className="text-2xl font-semibold text-black dark:text-white">새 앱</h1><AppForm action={createAppAction} submitLabel="앱 추가" error={searchParams?.error} /></main>;
}
