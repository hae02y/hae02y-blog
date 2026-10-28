'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BookMeta } from '@/lib/books';

interface BooksViewProps {
  books: BookMeta[];
  booksByYear: { year: string; books: BookMeta[] }[];
}

type ViewMode = 'grid' | 'timeline';

function formatDate(date?: string): string | undefined {
  if (!date) return undefined;
  return date.replaceAll('-', '.');
}

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return null;
  const rounded = Math.round(rating);
  return (
    <span className="font-mono text-xs tracking-[0.1em] text-amber-500/90 dark:text-amber-300/80" aria-label={`별점 ${rounded}점`}>
      {'★'.repeat(rounded)}
      <span className="text-black/20 dark:text-white/20">{'★'.repeat(Math.max(0, 5 - rounded))}</span>
    </span>
  );
}

function BookCard({ book }: { book: BookMeta }) {
  return (
    <Link
      href={book.href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/55 backdrop-blur transition duration-300 hover:-translate-y-1 hover:border-black/20 hover:bg-white/80 dark:border-white/10 dark:bg-white/[0.035] dark:hover:border-white/25 dark:hover:bg-white/[0.06]"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-black/5 dark:bg-white/10">
        {book.cover ? (
          <img
            src={book.cover}
            alt={`${book.title} 표지`}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-4 text-center text-sm font-medium leading-snug text-black/45 break-keep dark:text-white/45">
            {book.title}
          </div>
        )}
        {book.status === 'reading' && (
          <span className="absolute left-2 top-2 rounded-full bg-emerald-600/90 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
            읽는 중
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col p-3 md:p-4">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-[-0.02em] text-black break-keep dark:text-white md:text-base">
          {book.title}
        </h3>
        {book.author && (
          <p className="mt-1 line-clamp-1 text-xs text-black/45 dark:text-white/45">{book.author}</p>
        )}
        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <StarRating rating={book.rating} />
          {book.status === 'reading' ? (
            <span className="font-mono text-[10px] tracking-[0.1em] text-emerald-600 dark:text-emerald-400">
              읽는 중
            </span>
          ) : book.date ? (
            <span className="font-mono text-[10px] tracking-[0.1em] text-black/35 dark:text-white/35">
              {formatDate(book.date)}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}

export default function BooksView({ books, booksByYear }: BooksViewProps) {
  const [view, setView] = useState<ViewMode>('grid');

  if (books.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-black/45 dark:text-white/45">
        아직 기록한 책이 없습니다.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <span className="font-mono text-xs uppercase tracking-[0.2em] text-black/35 dark:text-white/35">
          {books.length} books
        </span>
        <div className="inline-flex items-center gap-1 rounded-full border border-black/10 bg-white/60 p-1 text-xs backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
          {(['grid', 'timeline'] as ViewMode[]).map(mode => (
            <button
              key={mode}
              type="button"
              onClick={() => setView(mode)}
              aria-pressed={view === mode}
              className={`rounded-full px-3.5 py-1.5 font-medium transition ${
                view === mode
                  ? 'bg-black text-white dark:bg-white dark:text-black'
                  : 'text-black/50 hover:text-black dark:text-white/50 dark:hover:text-white'
              }`}
            >
              {mode === 'grid' ? '그리드' : '타임라인'}
            </button>
          ))}
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {books.map(book => (
            <BookCard key={book.slug} book={book} />
          ))}
        </div>
      ) : (
        <div className="space-y-10">
          {booksByYear.map(group => (
            <section key={group.year}>
              <div className="mb-4 flex items-baseline gap-3">
                <h2 className="text-2xl font-semibold tracking-[-0.04em] text-black dark:text-white md:text-3xl">
                  {group.year}
                </h2>
                <span className="font-mono text-xs text-black/35 dark:text-white/35">
                  {group.books.length}권
                </span>
                <span className="h-px flex-1 bg-black/10 dark:bg-white/10" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {group.books.map(book => (
                  <BookCard key={book.slug} book={book} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
