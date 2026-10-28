import { Suspense } from 'react';
import Link from 'next/link';
import type { Metadata } from 'next';
import BlogSearch from '@/components/blog/BlogSearch';
import { getBlogSearchDocuments } from '@/lib/posts';

export const metadata: Metadata = {
  title: 'TECH 검색',
  description: 'Hae02y Devlog의 기술 글을 제목, 태그, 본문으로 검색합니다.',
  alternates: { canonical: '/search/' },
  robots: { index: false, follow: true },
};

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const documents = await getBlogSearchDocuments();

  return (
    <div className="mx-auto mt-6 px-4 md:mt-10">
      <main className="mx-auto w-full max-w-[700px] px-4">
        <section className="relative overflow-hidden border-2 border-black bg-[#f7f7f2] brutal-shadow dark:border-white dark:bg-[#161616]">
          <div className="brutal-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative z-10 px-4 py-6 md:px-6">
            <div className="flex items-center justify-between gap-3 border-2 border-black bg-black px-3 py-2 font-mono text-[11px] uppercase tracking-[0.25em] text-white dark:border-white dark:bg-white dark:text-black">
              <span>TECH Search</span>
              <Link href="/blog/" className="text-inherit hover:opacity-70">Back to TECH ↗</Link>
            </div>
            <h1 className="mb-0 mt-6 text-4xl font-extrabold uppercase tracking-tight text-black dark:text-white md:text-5xl">
              SEARCH.
            </h1>
          </div>
        </section>

        <section className="mt-6">
          <Suspense fallback={<p className="font-mono text-sm">검색을 준비하고 있습니다…</p>}>
            <BlogSearch documents={documents} />
          </Suspense>
        </section>
      </main>
      <footer className="h-[60px]" />
    </div>
  );
}
