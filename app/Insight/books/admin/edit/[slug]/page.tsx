import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/books-admin';
import { updateBookAction, getBookRowForEdit } from '@/lib/books-actions';
import BookForm from '@/components/insight/BookForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: '책 수정', robots: { index: false } };

export default async function EditBookPage({ params }: { params: { slug: string } }) {
  if (!isAdmin()) redirect('/Insight/books/admin/login');

  const slug = decodeURIComponent(params.slug);
  const book = await getBookRowForEdit(slug);
  if (!book) notFound();

  const action = updateBookAction.bind(null, slug);

  return (
    <div className="mx-auto min-h-screen max-w-[640px] px-4 pt-10 md:pt-16">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">책 수정</h1>
      <p className="mt-2 text-sm text-black/45 dark:text-white/45">{book.title}</p>
      <div className="mt-7">
        <BookForm action={action} defaults={book} submitLabel="수정 저장" />
      </div>
    </div>
  );
}
