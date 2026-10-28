import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/books-admin';
import { createBookAction } from '@/lib/books-actions';
import BookForm from '@/components/insight/BookForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: '새 책 추가', robots: { index: false } };

export default function NewBookPage() {
  if (!isAdmin()) redirect('/Insight/books/admin/login');

  return (
    <div className="mx-auto min-h-screen max-w-[640px] px-4 pt-10 md:pt-16">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">새 책 추가</h1>
      <p className="mt-2 text-sm text-black/45 dark:text-white/45">제목만 있으면 저장할 수 있어요.</p>
      <div className="mt-7">
        <BookForm action={createBookAction} submitLabel="저장" />
      </div>
    </div>
  );
}
