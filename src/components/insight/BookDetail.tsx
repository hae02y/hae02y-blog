'use client';

import { useRouter } from 'next/navigation';
import type { BookDetail as BookDetailType } from '@/lib/books';
import { MarkdownRenderer } from '@/lib/markdown-renderer';

interface BookDetailProps {
  book: BookDetailType;
}

function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  return date.replaceAll('-', '.');
}

export default function BookDetail({ book }: BookDetailProps) {
  const router = useRouter();
  const rounded = book.rating ? Math.round(book.rating) : 0;

  return (
    <div className="relative mx-auto min-h-screen overflow-hidden px-4 pt-7 md:pt-14">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-[#ead7c1]/45 blur-3xl dark:bg-white/10 md:top-14 md:h-[360px] md:w-[360px]" />
      <main className="mx-auto w-full max-w-[760px]">
        <header className="grid gap-5 rounded-3xl border border-black/10 bg-white/60 p-5 backdrop-blur dark:border-white/10 dark:bg-white/[0.04] md:grid-cols-[180px_1fr] md:gap-7 md:p-7">
          <div className="mx-auto w-[150px] md:mx-0 md:w-full">
            <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-black/5 shadow-[0_14px_40px_rgba(0,0,0,0.14)] dark:bg-white/10">
              {book.cover ? (
                <img src={book.cover} alt={`${book.title} 표지`} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-medium text-black/45 break-keep dark:text-white/45">
                  {book.title}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-black/40 dark:text-white/40">
                BOOK
              </span>
              {book.status === 'reading' && (
                <span className="rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-medium text-white">
                  읽는 중
                </span>
              )}
            </div>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-[-0.04em] text-black break-keep dark:text-white md:text-3xl">
              {book.title}
            </h1>
            {book.author && (
              <p className="mt-2 text-sm text-black/55 dark:text-white/55 md:text-base">{book.author}</p>
            )}

            <dl className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {book.rating ? (
                <div className="flex items-center gap-2">
                  <dt className="text-black/40 dark:text-white/40">별점</dt>
                  <dd className="font-mono tracking-[0.1em] text-amber-500/90 dark:text-amber-300/80">
                    {'★'.repeat(rounded)}
                    <span className="text-black/20 dark:text-white/20">{'★'.repeat(Math.max(0, 5 - rounded))}</span>
                  </dd>
                </div>
              ) : null}
              {book.status === 'reading' ? (
                <div className="flex items-center gap-2">
                  <dt className="text-black/40 dark:text-white/40">상태</dt>
                  <dd className="text-emerald-600 dark:text-emerald-400">읽는 중</dd>
                </div>
              ) : book.date ? (
                <div className="flex items-center gap-2">
                  <dt className="text-black/40 dark:text-white/40">읽은 날</dt>
                  <dd className="font-mono text-black/60 dark:text-white/60">{formatDate(book.date)}</dd>
                </div>
              ) : null}
            </dl>

            {book.link && (
              <a
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-85 dark:bg-white dark:text-black"
              >
                원문 보기 ↗
              </a>
            )}
          </div>
        </header>

        {book.content.trim() && (
          <article className="brunch-article mt-8">
            <div className="brunch-content">
              <MarkdownRenderer content={book.content} assetBasePath={book.assetBasePath} />
            </div>
          </article>
        )}

        <footer className="mt-10">
          <button
            onClick={() => router.push('/Insight/books/')}
            className="font-mono text-xs uppercase tracking-[0.2em] text-black/45 transition hover:text-black dark:text-white/45 dark:hover:text-white"
          >
            ← 서재로 돌아가기
          </button>
        </footer>
      </main>
      <div className="h-[72px]" />
    </div>
  );
}
