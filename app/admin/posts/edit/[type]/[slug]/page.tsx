import { notFound, redirect } from 'next/navigation';
import { isAdmin } from '@/lib/books-admin';
import { updatePostAction, getPostRowForEdit } from '@/lib/posts-actions';
import PostForm from '@/components/admin/PostForm';

export const dynamic = 'force-dynamic';
export const metadata = { title: '글 수정', robots: { index: false } };

export default async function EditPostPage({ params }: { params: { type: string; slug: string } }) {
  if (!isAdmin()) redirect('/admin/login');
  const type = params.type === 'essay' ? 'essay' : 'blog';
  const slug = decodeURIComponent(params.slug);

  const post = await getPostRowForEdit(type, slug);
  if (!post) notFound();

  const action = updatePostAction.bind(null, type, slug);

  return (
    <div className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">글 수정</h1>
      <p className="mt-2 truncate text-sm text-black/45 dark:text-white/45">{post.title}</p>
      <div className="mt-7">
        <PostForm action={action} type={type} defaults={post} submitLabel="수정 저장" />
      </div>
    </div>
  );
}
