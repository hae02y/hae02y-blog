import { getAllBooks, getBooksByYear } from '@/lib/books';
import BooksView from '@/components/insight/BooksView';
import EssayTabs from '@/components/insight/EssayTabs';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = createPageMetadata({
  title: '서재',
  socialTitle: '서재 | Hae02y Devlog',
  description: '읽은 책과 그때의 생각을 모아 둔 기록.',
  path: '/Insight/books/',
});

export default function BooksPage() {
  const books = getAllBooks();
  const booksByYear = getBooksByYear();

  return (
    <div className="relative mx-auto min-h-screen overflow-hidden px-4 pt-7 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#ead7c1]/45 blur-3xl dark:bg-white/10 md:top-14 md:h-[360px] md:w-[360px]" />
      <main className="mx-auto w-full max-w-[860px]">
        <section className="pb-7 text-center md:pb-9">
          <h1 className="text-4xl font-semibold tracking-[-0.06em] text-black dark:text-white md:text-6xl">
            서재
          </h1>
          <p className="mx-auto mt-4 max-w-[520px] text-sm leading-7 text-black/55 break-keep dark:text-white/55 md:mt-5 md:max-w-[560px] md:text-lg md:leading-8">
            읽은 책과 그때의 생각을 오래 기억하기 위한 기록.
          </p>
        </section>

        <EssayTabs active="books" />

        <BooksView books={books} booksByYear={booksByYear} />
      </main>
      <footer className="h-[72px]" />
    </div>
  );
}
