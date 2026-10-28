import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllInsightPosts } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 6;

export const dynamic = 'force-dynamic';

export function generateMetadata({ params }: { params: { page: string } }): Metadata {
  const pageNum = Number(params.page);
  const path = pageNum === 1 ? '/Insight/' : `/Insight/page/${params.page}/`;

  return {
    ...createPageMetadata({
      title: `ESSAY - 페이지 ${params.page}`,
      description: `생각과 책, 여행을 오래 기억하기 위한 에세이 ${params.page}페이지.`,
      path,
    }),
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function InsightPageN({ params }: { params: { page: string } }) {
  const pageNum = Number(params.page);
  if (Number.isNaN(pageNum) || pageNum < 1) notFound();

  const allPosts = await getAllInsightPosts();
  const postsWithoutFeatured = allPosts.slice(1);
  const totalPages = Math.ceil(postsWithoutFeatured.length / POSTS_PER_PAGE);
  const start = (pageNum - 1) * POSTS_PER_PAGE;
  const posts = postsWithoutFeatured.slice(start, start + POSTS_PER_PAGE);

  if (posts.length === 0) notFound();

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="relative mx-auto min-h-screen overflow-hidden px-4 pt-7 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#ead7c1]/45 blur-3xl dark:bg-white/10 md:top-14 md:h-[360px] md:w-[360px]" />
      <main className="mx-auto w-full max-w-[860px]">
        <section className="pb-7 text-center md:pb-9">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-black dark:text-white md:text-6xl">
            ESSAY
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-7 text-black/55 break-keep dark:text-white/55 md:mt-5 md:max-w-[560px] md:text-lg md:leading-8">
            생각과 책, 여행을 오래 기억하기 위한 기록.
          </p>
        </section>

        <section className="grid gap-3 md:grid-cols-2 md:gap-4">
          {posts.map((post, index) => (
            <article key={post.href} className="group overflow-hidden rounded-3xl border border-black/10 bg-white/55 backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-black/20 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/25 dark:hover:bg-white/[0.06]">
              <Link href={post.href} className="grid h-full grid-cols-[112px_1fr] gap-4 p-4 md:grid-cols-1 md:gap-0 md:p-0">
                {post.heroImage && (
                  <div className="h-full min-h-[112px] overflow-hidden rounded-2xl bg-black/5 dark:bg-white/10 md:h-40 md:rounded-none">
                    <img src={post.heroImage} alt={`${post.title} 표지`} className="h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                  </div>
                )}
                <div className="flex min-w-0 flex-col p-0 md:p-5">
                  <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
                    <span>{String(start + index + 2).padStart(2, '0')}</span>
                    {post.date && <span>/</span>}
                    {post.date && <span>{dateFormatter.format(new Date(post.date))}</span>}
                  </div>
                  <h2 className="mt-2 text-xl font-semibold leading-snug tracking-[-0.04em] text-black break-keep dark:text-white md:text-2xl">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/42 break-keep dark:text-white/42">
                    {post.description}
                  </p>
                  <div className="mt-auto hidden pt-5 font-mono text-[10px] uppercase tracking-[0.22em] text-black/35 transition group-hover:translate-x-1 dark:text-white/35 md:block">
                    {post.readingTime} min read →
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </section>

        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                key={page}
                href={page === 1 ? '/Insight/' : `/Insight/page/${page}/`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  page === pageNum
                    ? 'bg-black text-white dark:bg-white dark:text-black'
                    : 'border border-black/15 text-black/60 hover:border-black/30 hover:text-black dark:border-white/15 dark:text-white/60 dark:hover:border-white/30 dark:hover:text-white'
                }`}
              >
                {page}
              </Link>
            ))}
          </nav>
        )}
      </main>
      <footer className="h-[72px]" />
    </div>
  );
}
