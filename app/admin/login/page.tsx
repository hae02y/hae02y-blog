import { redirect } from 'next/navigation';
import { adminLoginAction } from '@/lib/posts-actions';
import { isAdmin, adminConfigured } from '@/lib/books-admin';

export const dynamic = 'force-dynamic';
export const metadata = { title: '관리자 로그인', robots: { index: false } };

export default function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  if (isAdmin()) redirect('/admin');
  const configured = adminConfigured();

  return (
    <div className="mx-auto flex min-h-screen max-w-[420px] flex-col justify-center px-4">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white">콘텐츠 관리</h1>
      <p className="mt-2 text-sm text-black/50 dark:text-white/50">글을 쓰고 수정하려면 로그인하세요.</p>

      {!configured ? (
        <p className="mt-6 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-700 dark:text-amber-300">
          관리자 비밀번호가 설정되지 않았습니다. Vercel 환경변수에 <code>BOOKS_ADMIN_PASSWORD</code>를 추가해 주세요.
        </p>
      ) : (
        <form action={adminLoginAction} className="mt-6 space-y-4">
          {searchParams?.error && (
            <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
              비밀번호가 올바르지 않습니다.
            </p>
          )}
          <input
            type="password"
            name="password"
            required
            autoFocus
            placeholder="비밀번호"
            className="w-full rounded-xl border border-black/15 bg-white/70 px-3.5 py-2.5 text-sm text-black outline-none transition focus:border-black/40 dark:border-white/15 dark:bg-white/[0.05] dark:text-white dark:focus:border-white/40"
          />
          <button type="submit" className="w-full rounded-full bg-black px-6 py-2.5 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black">
            로그인
          </button>
        </form>
      )}

      <a href="/" className="mt-6 text-xs text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white">← 홈으로</a>
    </div>
  );
}
