/**
 * Build-time seed: blog + essay 마크다운을 posts 테이블로 넣는다.
 * - DATABASE_URL 없으면(로컬 빌드) 조용히 스킵.
 * - ON CONFLICT (type, slug) DO NOTHING → 멱등. 어드민에서 수정한 글은 덮어쓰지 않음.
 * - 이미지는 repo(public)에 그대로 두고, 본문의 상대경로만 절대경로로 치환.
 */
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import pg from 'pg';

const BLOG_DIR = path.join(process.cwd(), 'blog');
const INSIGHT_DIR = path.join(process.cwd(), 'Insight');

const DDL = `
CREATE TABLE IF NOT EXISTS posts (
  id serial PRIMARY KEY,
  type text NOT NULL,
  slug text NOT NULL,
  title text NOT NULL,
  description text,
  content text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  authors text[] NOT NULL DEFAULT '{}',
  hero_image text,
  date text,
  comments boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS posts_type_slug_idx ON posts (type, slug);
CREATE INDEX IF NOT EXISTS posts_type_date_idx ON posts (type, date);
`;

function normalizeDate(value) {
  if (!value) return null;
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  const str = String(value).trim();
  const d = new Date(str);
  return Number.isNaN(d.getTime()) ? str : d.toISOString().slice(0, 10);
}

function normalizeTags(value) {
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === 'string') return value.split(',').map(t => t.trim()).filter(Boolean);
  return [];
}

function rewriteImages(content, base) {
  // Markdown ![alt](src) 의 상대경로를 절대경로로.
  let out = content.replace(/(!\[[^\]]*\]\()([^)\s]+)([^)]*\))/g, (m, pre, src, post) => {
    if (/^https?:\/\//i.test(src) || src.startsWith('/')) return m;
    return `${pre}${base}/${src.replace(/^\.\//, '')}${post}`;
  });
  // <img src="relative">
  out = out.replace(/(<img[^>]*\ssrc=["'])([^"']+)(["'])/g, (m, pre, src, post) => {
    if (/^https?:\/\//i.test(src) || src.startsWith('/')) return m;
    return `${pre}${base}/${src.replace(/^\.\//, '')}${post}`;
  });
  return out;
}

function stripToText(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*{1,3}([^*]+)\*{1,3}/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstImage(content, base) {
  const m = content.match(/!\[[^\]]*\]\(([^)\s]+)(?:\s+["'][^"']*["'])?\)/);
  if (!m) return null;
  const src = m[1];
  if (/^https?:\/\//i.test(src) || src.startsWith('/')) return src;
  return `${base}/${src.replace(/^\.\//, '')}`;
}

function collectBlog() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const rows = [];
  for (const dir of fs.readdirSync(BLOG_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const match = dir.name.match(/^(\d{4}-\d{2}-\d{2})-(.+)$/);
    const file = path.join(BLOG_DIR, dir.name, 'index.md');
    if (!match || !fs.existsSync(file)) continue;

    const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
    const base = `/blog/${dir.name}`;
    const body = rewriteImages(content, base);
    const hero = data.heroImage || data.image;
    rows.push({
      type: 'blog',
      slug: data.slug || match[2],
      title: data.title || match[2],
      description: data.description || (stripToText(content).slice(0, 100) + '…'),
      content: body,
      tags: normalizeTags(data.tags),
      authors: normalizeTags(data.authors),
      heroImage: hero
        ? (/^https?:\/\//i.test(String(hero)) || String(hero).startsWith('/') ? String(hero) : `${base}/${String(hero)}`)
        : firstImage(content, base),
      date: match[1],
      comments: data.comments !== false,
    });
  }
  return rows;
}

function collectEssay() {
  if (!fs.existsSync(INSIGHT_DIR)) return [];
  const rows = [];
  for (const dir of fs.readdirSync(INSIGHT_DIR, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const file = path.join(INSIGHT_DIR, dir.name, 'index.md');
    if (!fs.existsSync(file)) continue;

    const { data, content } = matter(fs.readFileSync(file, 'utf-8'));
    const base = `/Insight/${dir.name}`;
    const body = rewriteImages(content, base);
    const hero = data.heroImage || data.image;
    rows.push({
      type: 'essay',
      slug: dir.name,
      title: data.title || dir.name,
      description: data.description || (stripToText(content).slice(0, 120)),
      content: body,
      tags: normalizeTags(data.tags),
      authors: [],
      heroImage: hero
        ? (/^https?:\/\//i.test(String(hero)) || String(hero).startsWith('/') ? String(hero) : `${base}/${String(hero)}`)
        : firstImage(content, base),
      date: normalizeDate(data.date),
      comments: true,
    });
  }
  return rows;
}

async function main() {
  if (!process.env.DATABASE_URL) {
    console.log('seed-posts: DATABASE_URL 없음 → 스킵 (로컬 빌드)');
    return;
  }

  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  try {
    await client.query(DDL);

    // DB가 원본(source of truth). 최초 1회만 md에서 시드하고,
    // 이후엔 스킵 → 어드민에서 삭제한 글이 재삽입되지 않음.
    const existing = await client.query('SELECT count(*)::int AS n FROM posts');
    if ((existing.rows[0]?.n ?? 0) > 0) {
      console.log(`seed-posts: posts에 이미 ${existing.rows[0].n}개 존재 → 시드 스킵`);
      return;
    }

    const rows = [...collectBlog(), ...collectEssay()];
    let inserted = 0;
    for (const r of rows) {
      const res = await client.query(
        `INSERT INTO posts (type, slug, title, description, content, tags, authors, hero_image, date, comments)
         VALUES ($1,$2,$3,$4,$5,$6::text[],$7::text[],$8,$9,$10)
         ON CONFLICT (type, slug) DO NOTHING`,
        [r.type, r.slug, r.title, r.description, r.content, r.tags, r.authors, r.heroImage, r.date, r.comments],
      );
      inserted += res.rowCount || 0;
    }
    console.log(`seed-posts: ${rows.length}개 중 ${inserted}개 신규 삽입 (${rows.length - inserted}개 기존 유지)`);
  } finally {
    await client.end();
  }
}

main().catch(err => {
  console.error('seed-posts 실패:', err);
  process.exit(1);
});
