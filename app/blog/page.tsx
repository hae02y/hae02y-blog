import Link from 'next/link';
import { getPaginatedPosts } from '@/lib/posts';
import BlogPaginator from '@/components/blog/BlogPaginator';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: 'TECH',
  socialTitle: 'TECH | Hae02y Devlog',
  description: 'Java, Spring Boot, AWS, Kubernetes, DevOps, AI를 다루는 정해영(hae02y)의 기술 글 아카이브.',
  path: '/blog/',
});

export const dynamic = 'force-dynamic';

export default async function BlogListPage() {
  const { posts, totalPages, currentPage } = await getPaginatedPosts(1);

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10">
      <main className="mx-auto max-w-[700px] px-4 w-full">
        <div className="not-prose">
          {/* Header */}
          <section className="relative border-2 border-black dark:border-white bg-[#f7f7f2] dark:bg-[#161616] brutal-shadow overflow-hidden">
            <div className="brutal-grid absolute inset-0 opacity-40 pointer-events-none" />
            <div className="relative z-10 px-4 md:px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 border border-current" />
                  <span>TECH Index</span>
                </div>
                <span className="text-[10px]">Hae02y System Log</span>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white">
                    TECH.
                  </h1>
                </div>
                <Link
                  className="inline-flex items-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-black dark:text-white brutal-shadow hover:-translate-y-1 transition-transform"
                  href="/blog/tags/"
                >
                  All Tags
                  <span className="text-base">↗</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Posts */}
          <div className="mt-6 flex flex-col gap-6">
            {posts.map((post, index) => (
              <article
                key={post.slug}
                className="group border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-5 py-6 md:px-6 md:py-7 flex flex-col md:flex-row gap-4 md:gap-8 transition-transform duration-200 hover:-translate-y-1 hover:-rotate-1"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.15em]">
                      {dateFormatter.format(new Date(post.date))}
                    </span>
                    <span className="border-2 border-black/30 dark:border-white/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.15em] text-black/60 dark:text-white/60">
                      {post.readingTime} min
                    </span>
                  </div>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="mt-3 block text-2xl md:text-3xl font-bold text-black dark:text-white group-hover:underline"
                  >
                    {post.title}
                  </Link>
                  <p className="mt-3 text-sm md:text-base text-black/70 dark:text-white/70 line-clamp-2">
                    {post.description || 'No description available.'}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.map(tag => (
                      <Link
                        key={tag}
                        className="border-2 border-black dark:border-white bg-white dark:bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black dark:text-white transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                        href={`/blog/tags/${encodeURIComponent(tag)}/`}
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between md:flex-col md:items-end gap-4">
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="border-2 border-black dark:border-white px-4 py-2 font-mono text-xs uppercase tracking-[0.25em] text-black dark:text-white transition-transform group-hover:-translate-y-1"
                  >
                    Read
                  </Link>
                  <Link
                    href={`/blog/${post.slug}/`}
                    className="h-12 w-12 border-2 border-black dark:border-white flex items-center justify-center text-xl text-black dark:text-white transition-transform group-hover:-translate-y-1"
                    aria-label={`${post.title} 읽기`}
                  >
                    →
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* Paginator */}
          <div className="mt-10 flex justify-center">
            <div className="border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-4 py-3">
              <BlogPaginator totalPages={totalPages} currentPage={currentPage} />
            </div>
          </div>
        </div>
      </main>
      <footer className="h-[60px]" />
    </div>
  );
}
