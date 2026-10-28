import { redirect } from 'next/navigation';
import { isAdmin } from '@/lib/books-admin';
import { createPostAction } from '@/lib/posts-actions';
import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: '새 글', robots: { index: false } };

export default function NewPostPage({ searchParams }: { searchParams: { type?: string } }) {
  if (!isAdmin()) redirect('/admin/login');
  const type = searchParams?.type === 'essay' ? 'essay' : 'blog';
  const label = type === 'essay' ? '에세이' : '기술 글';

  return (
    <div className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">새 {label}</h1>
      <div className="mt-7">
        <PostForm action={createPostAction} type={type} submitLabel="발행" isNew />
      </div>
    </div>
  );
}
