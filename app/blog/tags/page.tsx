import Link from 'next/link';
import { getAllTags } from '@/lib/posts';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...createPageMetadata({
    title: 'TECH Tags',
    description: '정해영(hae02y)의 기술 글을 주제별로 탐색하는 태그 목록.',
    path: '/blog/tags/',
  }),
  robots: {
    index: false,
    follow: true,
  },
};

export const dynamic = 'force-dynamic';

export default async function BlogTagsListPage() {
  const tags = await getAllTags();
  const totalPosts = tags.reduce((sum, tag) => sum + tag.count, 0);
  const topTags = [...tags].sort((a, b) => b.count - a.count).slice(0, 3);

  return (
    <div className="mx-auto px-4 mt-6 md:mt-10">
      <main className="mx-auto max-w-[700px] px-4 w-full">
        <div className="not-prose">
          <section className="relative border-2 border-black dark:border-white bg-[#f7f7f2] dark:bg-[#161616] brutal-shadow overflow-hidden">
            <div className="brutal-grid absolute inset-0 opacity-40 pointer-events-none" />
            <div className="relative z-10 px-4 md:px-6 py-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em]">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 border border-current" />
                  <span>Tags Index</span>
                </div>
                <span className="text-[10px]">Hae02y System Log</span>
              </div>
              <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
                <div>
                  <h1 className="text-4xl md:text-5xl font-extrabold uppercase tracking-tight text-black dark:text-white">
                    Tags.
                  </h1>
                  <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-black/70 dark:text-white/70">
                    Index the archive.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    className="inline-flex items-center gap-2 border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-2 font-mono text-xs uppercase tracking-[0.2em] text-black dark:text-white brutal-shadow hover:-translate-y-1 transition-transform"
                    href="/blog/"
                  >
                    TECH <span className="text-base">↗</span>
                  </Link>
                  <div className="border-2 border-black dark:border-white bg-white dark:bg-black px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-black dark:text-white brutal-shadow">
                    Total {tags.length} / Posts {totalPosts}
                  </div>
                </div>
              </div>
              {topTags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="font-mono text-[10px] uppercase tracking-[0.35em] text-black/70 dark:text-white/70">
                    Top Tags
                  </span>
                  {topTags.map(tag => (
                    <Link
                      key={tag.label}
                      href={tag.permalink}
                      className="border-2 border-black dark:border-white bg-white dark:bg-black px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-black dark:text-white transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
                    >
                      {tag.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tags.map(tag => (
              <Link
                key={tag.permalink}
                href={tag.permalink}
                className="group border-2 border-black dark:border-white bg-white dark:bg-black brutal-shadow px-5 py-4 flex flex-col gap-4 transition-transform hover:-translate-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-black/60 dark:text-white/60">
                    Tag
                  </span>
                  <span className="text-xl text-black dark:text-white">↗</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    {tag.label}
                  </h2>
                  <p className="mt-2 font-mono text-xs uppercase tracking-[0.25em] text-black/70 dark:text-white/70">
                    {tag.count} posts
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <footer className="h-[60px]" />
    </div>
  );
}
