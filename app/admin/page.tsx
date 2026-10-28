import { redirect } from 'next/navigation';
import Link from 'next/link';
import { eq, count } from 'drizzle-orm';
import { isAdmin } from '@/lib/books-admin';
import { adminLogoutAction } from '@/lib/posts-actions';
import { getDb, schema } from '@/db';

export const dynamic = 'force-dynamic';
export const metadata = { title: '콘텐츠 관리', robots: { index: false } };

async function counts() {
  const db = getDb();
  const [blog] = await db.select({ c: count() }).from(schema.posts).where(eq(schema.posts.type, 'blog'));
  const [essay] = await db.select({ c: count() }).from(schema.posts).where(eq(schema.posts.type, 'essay'));
  const [books] = await db.select({ c: count() }).from(schema.books);
  return { blog: blog?.c ?? 0, essay: essay?.c ?? 0, books: books?.c ?? 0 };
}

export default async function AdminHome() {
  if (!isAdmin()) redirect('/admin/login');
  const c = await counts();

  const cards = [
    { href: '/admin/posts?type=blog', label: '기술 글 (블로그)', count: c.blog },
    { href: '/admin/posts?type=essay', label: '에세이', count: c.essay },
    { href: '/Insight/books/admin', label: '서재 (책)', count: c.books },
  ];

  return (
    <div className="mx-auto min-h-screen max-w-[720px] px-4 pt-10 md:pt-16">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-[-0.03em] text-black dark:text-white md:text-3xl">콘텐츠 관리</h1>
        <form action={adminLogoutAction}>
          <button type="submit" className="text-sm text-black/50 transition hover:text-black dark:text-white/50 dark:hover:text-white">로그아웃</button>
        </form>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {cards.map(card => (
          <Link key={card.href} href={card.href} className="rounded-2xl border border-black/10 bg-white/55 p-5 backdrop-blur transition hover:-translate-y-0.5 hover:border-black/20 dark:border-white/10 dark:bg-white/[0.04] dark:hover:border-white/25">
            <p className="text-sm font-medium text-black dark:text-white">{card.label}</p>
            <p className="mt-2 font-mono text-2xl font-semibold text-black dark:text-white">{card.count}</p>
            <p className="mt-1 text-xs text-black/40 dark:text-white/40">관리 →</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
