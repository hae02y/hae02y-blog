import 'server-only';
import { eq } from 'drizzle-orm';
import { getDb, schema } from '@/db';
import type { BookRow } from '@/db/schema';

export type BookStatus = 'reading' | 'finished';

export type BookMeta = {
  slug: string;
  href: string;
  title: string;
  author?: string;
  cover?: string;
  link?: string;
  date?: string;
  year: string;
  rating?: number;
  description?: string;
  status: BookStatus;
};

export type BookDetail = BookMeta & {
  content: string;
  assetBasePath?: string;
};

const UNDATED = '미분류';
const READING_GROUP = '읽는 중';

function normalizeStatus(value: string | null): BookStatus {
  return value === 'reading' ? 'reading' : 'finished';
}

function rowToMeta(row: BookRow): BookMeta {
  const date = row.readDate || undefined;
  return {
    slug: row.slug,
    href: `/Insight/books/${encodeURIComponent(row.slug)}/`,
    title: row.title,
    author: row.author || undefined,
    cover: row.cover || undefined,
    link: row.link || undefined,
    date,
    year: date ? date.slice(0, 4) : UNDATED,
    rating: row.rating ?? undefined,
    description: row.description || undefined,
    status: normalizeStatus(row.status),
  };
}

function rowToDetail(row: BookRow): BookDetail {
  return {
    ...rowToMeta(row),
    content: row.content ?? '',
  };
}

function compareMeta(a: BookMeta, b: BookMeta): number {
  // Currently-reading books surface first, then finished ones by read date desc.
  if (a.status !== b.status) return a.status === 'reading' ? -1 : 1;
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.title.localeCompare(b.title, 'ko');
}

export async function getAllBooks(): Promise<BookMeta[]> {
  const rows = await getDb().select().from(schema.books);
  return rows.map(rowToMeta).sort(compareMeta);
}

export async function getBook(slug: string): Promise<BookDetail | undefined> {
  const rows = await getDb()
    .select()
    .from(schema.books)
    .where(eq(schema.books.slug, slug))
    .limit(1);
  return rows[0] ? rowToDetail(rows[0]) : undefined;
}

export async function getBooksByYear(): Promise<{ year: string; books: BookMeta[] }[]> {
  const all = await getAllBooks();
  const reading = all.filter(book => book.status === 'reading');
  const finished = all.filter(book => book.status === 'finished');

  const grouped = new Map<string, BookMeta[]>();
  for (const book of finished) {
    const list = grouped.get(book.year) ?? [];
    list.push(book);
    grouped.set(book.year, list);
  }

  const yearGroups = Array.from(grouped.entries())
    .sort((a, b) => {
      if (a[0] === UNDATED) return 1;
      if (b[0] === UNDATED) return -1;
      return b[0].localeCompare(a[0]);
    })
    .map(([year, books]) => ({ year, books }));

  return reading.length > 0
    ? [{ year: READING_GROUP, books: reading }, ...yearGroups]
    : yearGroups;
}
