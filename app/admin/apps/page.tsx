import Link from 'next/link';
import { redirect } from 'next/navigation';
import { asc } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import { isAdmin } from '@/lib/books-admin';
import { deleteAppAction } from '@/lib/apps-actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: '앱 관리', robots: { index: false } };

export default async function AdminAppsPage() {
  if (!isAdmin()) redirect('/admin/login');
  const apps = await getDb().select().from(schema.apps).orderBy(asc(schema.apps.sortOrder), asc(schema.apps.id));

  return (
    <main className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <Link href="/admin" className="text-xs text-black/40 hover:text-black dark:text-white/40 dark:hover:text-white">← 관리 홈</Link>
      <div className="mt-2 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white md:text-3xl">앱 관리</h1>
        <Link href="/admin/apps/new" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-85 dark:bg-white dark:text-black">+ 새 앱</Link>
      </div>
      <p className="mt-3 text-sm text-black/50 dark:text-white/50">공개된 앱만 블로그 터미널의 apps 화면에 표시됩니다.</p>
      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/10">
        {apps.map(app => (
          <li key={app.id} className="flex items-center gap-3 py-4">
            {app.iconImage ? <img src={app.iconImage} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" /> : <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-black/5 font-mono text-lg dark:bg-white/10">{app.shortName.slice(0, 1)}</span>}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black dark:text-white">{app.name} <span className="ml-1 text-xs font-normal text-black/40 dark:text-white/40">{app.published ? '공개' : '비공개'}</span></p>
              <p className="truncate text-xs text-black/40 dark:text-white/40">{app.href}</p>
            </div>
            <Link href={`/admin/apps/edit/${app.id}`} className="text-xs text-black/55 hover:underline dark:text-white/55">수정</Link>
            <form action={deleteAppAction.bind(null, app.id)}><button type="submit" className="text-xs text-red-500 hover:text-red-600">삭제</button></form>
          </li>
        ))}
        {apps.length === 0 && <li className="py-10 text-center text-sm text-black/40 dark:text-white/40">등록된 앱이 없습니다.</li>}
      </ul>
    </main>
  );
}
