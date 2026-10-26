import { notFound } from 'next/navigation';
import { getAllBookSlugs, getBook } from '@/lib/books';
import BookDetail from '@/components/insight/BookDetail';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import '../../../blog/[slug]/brunch.css';

export function generateStaticParams() {
  return getAllBookSlugs().map(slug => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const slug = decodeURIComponent(params.slug);
  const book = getBook(slug);
  if (!book) return {};

  const descriptionParts = [book.author, book.description].filter(Boolean);

  return createPageMetadata({
    title: book.title,
    socialTitle: `${book.title} | 서재`,
    description: descriptionParts.join(' · ') || `${book.title} 독서 기록`,
    path: book.href,
    image: book.cover,
    imageAlt: `${book.title} 표지`,
  });
}

export default function BookDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const book = getBook(slug);
  if (!book) notFound();

  return <BookDetail book={book} />;
}
