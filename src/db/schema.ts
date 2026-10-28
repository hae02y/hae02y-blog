import { sql } from 'drizzle-orm';
import { pgTable, serial, text, integer, timestamp, boolean, index, uniqueIndex } from 'drizzle-orm/pg-core';

/**
 * 서재(독서 기록) 테이블.
 * 벤더 중립 Postgres 스키마 — Neon → 다른 Postgres로 이전해도 그대로 사용.
 */
export const books = pgTable(
  'books',
  {
    id: serial('id').primaryKey(),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    author: text('author'),
    cover: text('cover'),
    link: text('link'),
    // 읽은 날짜(YYYY-MM-DD). 읽는 중인 책은 null 가능.
    readDate: text('read_date'),
    rating: integer('rating'),
    // 'reading' | 'finished'
    status: text('status').notNull().default('finished'),
    description: text('description'),
    // 마크다운 본문(내 생각)
    content: text('content').notNull().default(''),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    statusIdx: index('books_status_idx').on(table.status),
    readDateIdx: index('books_read_date_idx').on(table.readDate),
  }),
);

export type BookRow = typeof books.$inferSelect;
export type NewBookRow = typeof books.$inferInsert;

/**
 * 블로그 글 + 에세이 통합 테이블. type으로 구분('blog' | 'essay').
 * URL은 blog → /blog/<slug>, essay → /Insight/<slug>.
 */
export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    type: text('type').notNull(), // 'blog' | 'essay'
    slug: text('slug').notNull(),
    title: text('title').notNull(),
    description: text('description'),
    content: text('content').notNull().default(''),
    tags: text('tags').array().notNull().default(sql`'{}'::text[]`),
    authors: text('authors').array().notNull().default(sql`'{}'::text[]`),
    heroImage: text('hero_image'),
    date: text('date'), // YYYY-MM-DD
    comments: boolean('comments').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => ({
    typeSlugIdx: uniqueIndex('posts_type_slug_idx').on(table.type, table.slug),
    typeDateIdx: index('posts_type_date_idx').on(table.type, table.date),
  }),
);

export type PostRow = typeof posts.$inferSelect;
export type NewPostRow = typeof posts.$inferInsert;
