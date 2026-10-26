import Link from 'next/link';
import { getAllInsightPosts } from '@/lib/docs';
import EssayTabs from '@/components/insight/EssayTabs';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

const POSTS_PER_PAGE = 6;

export const metadata: Metadata = createPageMetadata({
  title: 'ESSAY',
  socialTitle: 'ESSAY | Hae02y Devlog',
  description: '생각과 책, 여행을 오래 기억하기 위한 기록.',
  path: '/Insight/',
});

export default function InsightPage() {
  const allPosts = getAllInsightPosts();
  const [featuredPost, ...rest] = allPosts;
  const posts = rest.slice(0, POSTS_PER_PAGE);
  const totalPages = Math.ceil((allPosts.length - 1) / POSTS_PER_PAGE);
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

        <EssayTabs active="essay" />

        {featuredPost && (
          <section>
            <Link href={featuredPost.href} className="group block overflow-hidden rounded-3xl border border-black/10 bg-white/65 shadow-[0_18px_50px_rgba(0,0,0,0.07)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-black/20 dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_80px_rgba(0,0,0,0.45)] dark:hover:border-white/25 md:rounded-[2rem]">
              <article className="grid gap-0 md:grid-cols-[1.05fr_0.95fr]">
                {featuredPost.heroImage && (
                  <div className="relative min-h-[190px] overflow-hidden bg-black/5 dark:bg-white/10 md:min-h-[360px]">
                    <img src={featuredPost.heroImage} alt={`${featuredPost.title} 표지`} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-white/10 dark:from-black/55" />
                  </div>
                )}
                <div className="flex min-h-[250px] flex-col justify-between p-5 md:min-h-[320px] md:p-9">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-black/42 dark:text-white/42 md:text-[11px] md:tracking-[0.24em]">
                      <span>Featured</span>
                      <span>/</span>
                      {featuredPost.date && <span>{dateFormatter.format(new Date(featuredPost.date))}</span>}
                      {featuredPost.date && <span>/</span>}
                      <span>{featuredPost.readingTime} min read</span>
                    </div>
                    <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em] text-black break-keep dark:text-white md:mt-5 md:text-4xl md:tracking-[-0.055em]">
                      {featuredPost.title}
                    </h2>
                    <p className="mt-3 text-sm leading-7 text-black/55 break-keep dark:text-white/55 md:mt-4 md:text-base md:leading-8">
                      {featuredPost.description}
                    </p>
                    {featuredPost.tags.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2 md:mt-5">
                        {featuredPost.tags.map(tag => (
                          <span key={tag} className="rounded-full border border-black/10 bg-black/[0.025] px-2.5 py-1 text-[11px] text-black/45 dark:border-white/15 dark:bg-white/[0.04] dark:text-white/45 md:px-3 md:text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="mt-6 inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-black/45 transition group-hover:translate-x-1 dark:text-white/45 md:mt-8 md:text-[11px] md:tracking-[0.24em]">
                    Read ESSAY <span>→</span>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        <section className="mt-5 grid gap-3 md:mt-8 md:grid-cols-2 md:gap-4">
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
                    <span>{String(index + 2).padStart(2, '0')}</span>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="mt-10 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <Link
                key={page}
                href={page === 1 ? '/Insight/' : `/Insight/page/${page}/`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  page === 1
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
