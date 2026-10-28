'use client';

import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import type { BlogSearchDocument } from '@/lib/posts';

interface BlogSearchProps {
  documents: BlogSearchDocument[];
}

function normalize(value: string): string {
  return value.toLocaleLowerCase('ko-KR').normalize('NFKC');
}

function createSnippet(document: BlogSearchDocument, query: string): string {
  const text = document.searchText || document.description;
  const firstTerm = normalize(query).split(/\s+/).find(Boolean);
  if (!firstTerm) return document.description;

  const matchIndex = normalize(text).indexOf(firstTerm);
  if (matchIndex < 0) return document.description;

  const start = Math.max(0, matchIndex - 55);
  const end = Math.min(text.length, matchIndex + firstTerm.length + 110);
  return `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;
}

export default function BlogSearch({ documents }: BlogSearchProps) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q')?.trim() ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  const results = useMemo(() => {
    const terms = normalize(submittedQuery).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    return documents.filter(document => {
      const haystack = normalize([
        document.title,
        document.description,
        document.tags.join(' '),
        document.searchText,
      ].join(' '));

      return terms.every(term => haystack.includes(term));
    });
  }, [documents, submittedQuery]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextQuery = query.trim();
    setSubmittedQuery(nextQuery);

    const url = nextQuery ? `/search/?q=${encodeURIComponent(nextQuery)}` : '/search/';
    window.history.replaceState(null, '', url);
  };

  return (
    <div className="not-prose">
      <form onSubmit={handleSubmit} role="search" className="flex flex-col gap-3 sm:flex-row">
        <label htmlFor="blog-search" className="sr-only">블로그 글 검색</label>
        <input
          id="blog-search"
          name="q"
          type="search"
          value={query}
          onChange={event => setQuery(event.target.value)}
          placeholder="제목, 태그, 본문 검색"
          autoComplete="off"
          autoFocus
          className="min-w-0 flex-1 border-2 border-black bg-white px-4 py-3 font-mono text-sm text-black outline-none placeholder:text-black/45 focus:ring-2 focus:ring-black focus:ring-offset-2 dark:border-white dark:bg-black dark:text-white dark:placeholder:text-white/45 dark:focus:ring-white"
        />
        <button
          type="submit"
          className="border-2 border-black bg-black px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-transform hover:-translate-y-0.5 dark:border-white dark:bg-white dark:text-black"
        >
          Search
        </button>
      </form>

      <div className="mt-6" aria-live="polite">
        {submittedQuery ? (
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-black/60 dark:text-white/60">
            “{submittedQuery}” 검색 결과 {results.length}개
          </p>
        ) : (
          <p className="font-mono text-xs uppercase tracking-[0.16em] text-black/60 dark:text-white/60">
            검색어를 입력하면 모든 TECH 글에서 찾아드립니다.
          </p>
        )}
      </div>

      {submittedQuery && results.length === 0 && (
        <div className="mt-6 border-2 border-dashed border-black/40 px-5 py-10 text-center dark:border-white/40">
          <p className="font-mono text-sm text-black dark:text-white">검색 결과가 없습니다.</p>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-4">
        {results.map(document => (
          <article
            key={document.slug}
            className="border-2 border-black bg-white px-5 py-5 brutal-shadow transition-transform hover:-translate-y-1 dark:border-white dark:bg-black"
          >
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-black/60 dark:text-white/60">
              <time dateTime={document.date}>{document.date}</time>
              {document.tags.map(tag => <span key={tag}>#{tag}</span>)}
            </div>
            <h2 className="mb-0 mt-3 text-xl font-bold">
              <Link href={`/blog/${document.slug}/`} className="text-black hover:underline dark:text-white">
                {document.title}
              </Link>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-black/70 dark:text-white/70">
              {createSnippet(document, submittedQuery)}
            </p>
          </article>
        ))}
      </div>
    </div>
  );
}
