import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const BOOKS_DIR = path.join(process.cwd(), 'books');

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
};

export type BookDetail = BookMeta & {
  content: string;
  assetBasePath: string;
};

const UNDATED = '미분류';

function normalizeDate(value: unknown): string | undefined {
  if (!value) return undefined;
  if (value instanceof Date) {
    // gray-matter/js-yaml parses `2026-10-26` as a UTC-midnight Date.
    return value.toISOString().slice(0, 10);
  }
  const str = String(value).trim();
  const parsed = new Date(str);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);
  return str;
}

function resolveCover(cover: unknown, slug: string): string | undefined {
  if (typeof cover !== 'string' || !cover) return undefined;
  if (cover.startsWith('http') || cover.startsWith('/')) return cover;
  return `/books/${encodeURIComponent(slug)}/${cover}`;
}

function parseRating(value: unknown): number | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  const num = Number(value);
  if (!Number.isFinite(num)) return undefined;
  return Math.max(0, Math.min(5, num));
}

function getBookDirs(): string[] {
  if (!fs.existsSync(BOOKS_DIR)) return [];
  return fs
    .readdirSync(BOOKS_DIR, { withFileTypes: true })
    .filter(entry => entry.isDirectory() && !entry.name.startsWith('.'))
    .filter(entry => fs.existsSync(path.join(BOOKS_DIR, entry.name, 'index.md')))
    .map(entry => entry.name);
}

function readBook(slug: string): BookDetail | undefined {
  const filePath = path.join(BOOKS_DIR, slug, 'index.md');
  if (!fs.existsSync(filePath)) return undefined;

  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const date = normalizeDate(data.date);

  return {
    slug,
    href: `/Insight/books/${encodeURIComponent(slug)}/`,
    title: data.title ? String(data.title) : slug,
    author: data.author ? String(data.author) : undefined,
    cover: resolveCover(data.cover || data.heroImage || data.image, slug),
    link: data.link ? String(data.link) : undefined,
    date,
    year: date ? date.slice(0, 4) : UNDATED,
    rating: parseRating(data.rating),
    description: data.description ? String(data.description) : undefined,
    content,
    assetBasePath: `/books/${encodeURIComponent(slug)}`,
  };
}

function byDateDesc(a: BookMeta, b: BookMeta): number {
  if (a.date && b.date) return b.date.localeCompare(a.date);
  if (a.date) return -1;
  if (b.date) return 1;
  return a.title.localeCompare(b.title, 'ko');
}

export function getAllBookSlugs(): string[] {
  return getBookDirs();
}

export function getBook(slug: string): BookDetail | undefined {
  return readBook(slug);
}

export function getAllBooks(): BookMeta[] {
  return getBookDirs()
    .map(readBook)
    .filter((book): book is BookDetail => Boolean(book))
    .map(({ content, assetBasePath, ...meta }) => meta)
    .sort(byDateDesc);
}

export function getBooksByYear(): { year: string; books: BookMeta[] }[] {
  const grouped = new Map<string, BookMeta[]>();

  for (const book of getAllBooks()) {
    const list = grouped.get(book.year) ?? [];
    list.push(book);
    grouped.set(book.year, list);
  }

  return Array.from(grouped.entries())
    .sort((a, b) => {
      if (a[0] === UNDATED) return 1;
      if (b[0] === UNDATED) return -1;
      return b[0].localeCompare(a[0]);
    })
    .map(([year, books]) => ({ year, books }));
}
