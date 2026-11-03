/** Publish this repository post once. The database remains the source of truth afterward. */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import pg from 'pg';

const directory = '2026-11-03-ontology-rdf-owl-sparql-llm';
const file = path.join(process.cwd(), 'blog', directory, 'index.md');

if (!process.env.DATABASE_URL) {
  console.log('publish-ontology-post: DATABASE_URL 없음 → 스킵 (로컬 빌드)');
} else {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const slug = String(data.slug || directory.slice(11));
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS repo_post_publications (
        slug text PRIMARY KEY,
        published_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await client.query('BEGIN');
    const claimed = await client.query(
      'INSERT INTO repo_post_publications (slug) VALUES ($1) ON CONFLICT DO NOTHING RETURNING slug',
      [slug],
    );
    if (claimed.rowCount) {
      await client.query(
        `INSERT INTO posts (type, slug, title, description, content, tags, authors, hero_image, date, comments)
         VALUES ('blog', $1, $2, $3, $4, $5::text[], $6::text[], NULL, $7, $8)
         ON CONFLICT (type, slug) DO NOTHING`,
        [
          slug,
          String(data.title || slug),
          String(data.description || ''),
          content,
          Array.isArray(data.tags) ? data.tags.map(String) : [],
          Array.isArray(data.authors) ? data.authors.map(String) : [],
          directory.slice(0, 10),
          data.comments !== false,
        ],
      );
      console.log(`publish-ontology-post: ${slug} 최초 게시`);
    } else {
      console.log(`publish-ontology-post: ${slug} 이미 처리됨`);
    }
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    await client.end();
  }
}
