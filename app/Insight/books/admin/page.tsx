import { redirect } from 'next/navigation';
import Link from 'next/link';
import { isAdmin } from '@/lib/books-admin';
import { getAllBooks } from '@/lib/books';
import { deleteBookAction, logoutAction } from '@/lib/books-actions';

export const dynamic = 'force-dynamic';
export const metadata = { title: '서재 관리', robots: { index: false } };

export default async function BooksAdminPage() {
  if (!isAdmin()) redirect('/Insight/books/admin/login');
  const books = await getAllBooks();

  return (
    <div className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">서재 관리</h1>
        <div className="flex items-center gap-3">
          <Link href="/Insight/books/admin/new" className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black">
            + 새 책
          </Link>
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white">
              로그아웃
            </button>
          </form>
        </div>
      </div>

      <p className="mt-2 text-sm text-black/45 dark:text-white/45">{books.length}권 기록됨</p>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/10">
        {books.map(book => (
          <li key={book.slug} className="flex items-center gap-3 py-3">
            <div className="h-14 w-10 shrink-0 overflow-hidden rounded bg-black/5 dark:bg-white/10">
              {book.cover && <img src={book.cover} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black dark:text-white">
                {book.title}
                {book.status === 'reading' && <span className="ml-2 text-xs text-emerald-600 dark:text-emerald-400">읽는 중</span>}
              </p>
              <p className="truncate text-xs text-black/45 dark:text-white/45">
                {[book.author, book.date].filter(Boolean).join(' · ')}
              </p>
            </div>
            <Link href={`/Insight/books/admin/edit/${encodeURIComponent(book.slug)}`} className="text-xs text-black/55 underline-offset-2 transition hover:text-black hover:underline dark:text-white/55 dark:hover:text-white">
              수정
            </Link>
            <form action={deleteBookAction.bind(null, book.slug)}>
              <button type="submit" className="text-xs text-red-500/80 transition hover:text-red-600">
                삭제
              </button>
            </form>
          </li>
        ))}
        {books.length === 0 && (
          <li className="py-10 text-center text-sm text-black/40 dark:text-white/40">아직 기록한 책이 없습니다. “+ 새 책”으로 추가하세요.</li>
        )}
      </ul>

      <a href="/Insight/books/" className="mt-10 inline-block text-xs text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white">
        ← 서재 보기
      </a>
    </div>
  );
}
