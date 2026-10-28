import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq, desc } from 'drizzle-orm';
import { isAdmin } from '@/lib/books-admin';
import { deletePostAction } from '@/lib/posts-actions';
import { getDb, schema } from '@/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '글 관리', robots: { index: false } };

export default async function AdminPostsPage({ searchParams }: { searchParams: { type?: string } }) {
  if (!isAdmin()) redirect('/admin/login');
  const type = searchParams?.type === 'essay' ? 'essay' : 'blog';
  const label = type === 'essay' ? '에세이' : '기술 글';

  const posts = await getDb()
    .select({ slug: schema.posts.slug, title: schema.posts.title, date: schema.posts.date })
    .from(schema.posts)
    .where(eq(schema.posts.type, type))
    .orderBy(desc(schema.posts.date));

  return (
    <div className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin" className="text-xs text-black/40 transition hover:text-black dark:text-white/40 dark:hover:text-white">← 관리 홈</Link>
          <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">{label} 관리</h1>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/admin/posts?type=blog" className={type === 'blog' ? 'font-semibold text-black dark:text-white' : 'text-black/45 dark:text-white/45'}>블로그</Link>
          <span className="text-black/20">/</span>
          <Link href="/admin/posts?type=essay" className={type === 'essay' ? 'font-semibold text-black dark:text-white' : 'text-black/45 dark:text-white/45'}>에세이</Link>
        </div>
      </div>

      <div className="mt-6">
        <Link href={`/admin/posts/new?type=${type}`} className="rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black">
          + 새 {label}
        </Link>
      </div>

      <ul className="mt-6 divide-y divide-black/10 dark:divide-white/10">
        {posts.map(post => (
          <li key={post.slug} className="flex items-center gap-3 py-3">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-black dark:text-white">{post.title}</p>
              <p className="truncate font-mono text-xs text-black/40 dark:text-white/40">{post.date} · {post.slug}</p>
            </div>
            <Link href={`/admin/posts/edit/${type}/${encodeURIComponent(post.slug)}`} className="text-xs text-black/55 underline-offset-2 transition hover:text-black hover:underline dark:text-white/55 dark:hover:text-white">수정</Link>
            <form action={deletePostAction.bind(null, type, post.slug)}>
              <button type="submit" className="text-xs text-red-500/80 transition hover:text-red-600">삭제</button>
            </form>
          </li>
        ))}
        {posts.length === 0 && (
          <li className="py-10 text-center text-sm text-black/40 dark:text-white/40">아직 글이 없습니다.</li>
        )}
      </ul>
    </div>
  );
}
