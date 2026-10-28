import { notFound } from 'next/navigation';
import { getBook } from '@/lib/books';
import BookDetail from '@/components/insight/BookDetail';
import { createPageMetadata } from '@/lib/seo';
import type { Metadata } from 'next';
import '../../../blog/[slug]/brunch.css';

// Reads from the database at request time.
export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = decodeURIComponent(params.slug);
  const book = await getBook(slug);
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

export default async function BookDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug);
  const book = await getBook(slug);
  if (!book) notFound();

  return <BookDetail book={book} />;
}
