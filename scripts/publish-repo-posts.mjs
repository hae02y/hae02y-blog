/** Publish selected repository posts once; afterward, the database remains authoritative. */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import pg from 'pg';

const directories = [
  '2026-11-03-ontology-rdf-owl-sparql-llm',
  '2026-11-04-coding-agent-harness-app-launcher',
  '2026-11-16-dns-domain-records-authoritative-server',
  '2026-11-16-https-tls-certificates',
  '2026-11-16-local-rag-ollama',
];

function resolveImages(content, directory) {
  return content.replace(/(!\[[^\]]*\]\()([^)\s]+)([^)]*\))/g, (match, before, src, after) => {
    if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(src)) return match;
    return `${before}/blog/${directory}/${src.replace(/^\.\//, '')}${after}`;
  });
}

if (!process.env.DATABASE_URL) {
  console.log('publish-repo-posts: DATABASE_URL 없음 → 스킵 (로컬 빌드)');
} else {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS repo_post_publications (
        slug text PRIMARY KEY,
        published_at timestamptz NOT NULL DEFAULT now()
      )
    `);

    for (const directory of directories) {
      const file = path.join(process.cwd(), 'blog', directory, 'index.md');
      const { data, content } = matter(fs.readFileSync(file, 'utf8'));
      const slug = String(data.slug || directory.slice(11));

      await client.query('BEGIN');
      try {
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
              resolveImages(content, directory),
              Array.isArray(data.tags) ? data.tags.map(String) : [],
              Array.isArray(data.authors) ? data.authors.map(String) : [],
              directory.slice(0, 10),
              data.comments !== false,
            ],
          );
          console.log(`publish-repo-posts: ${slug} 최초 게시`);
        } else {
          console.log(`publish-repo-posts: ${slug} 이미 처리됨`);
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }

    // Add the requested illustration once without replacing later editor changes.
    const directory = '2026-11-16-local-rag-ollama';
    const illustrations = [
      ['local-rag-ollama:diagram-v1', '## 1. 이번에 만든 RAG의 범위', 'rag-pipeline.png'],
      ['local-rag-ollama:chunking-v1', '## 3. 문서를 어떻게 쪼갰는가', 'rag-chunking.png'],
      ['local-rag-ollama:grounding-v1', '## 6. 생성 모델에 전달한 근거와 출력 검사', 'rag-grounding.png'],
      ['local-rag-ollama:failures-v1', '## 7. 실제 질문으로 확인한 결과', 'rag-failures.png'],
    ];
    const source = matter(fs.readFileSync(path.join(process.cwd(), 'blog', directory, 'index.md'), 'utf8')).content;
    for (const [revision, anchor, filename] of illustrations) {
      if (source.split(anchor).length !== 2) throw new Error('RAG source anchor is missing or ambiguous');
      const section = source.slice(source.indexOf(anchor) + anchor.length).trimStart();
      const illustration = section.match(/^!\[[^\n]+\n\n\*[^\n]+\*/)?.[0];
      if (!illustration?.includes(`(./${filename})`)) throw new Error('RAG illustration source is missing');
      await client.query('BEGIN');
      try {
        const claimed = await client.query(
          'INSERT INTO repo_post_publications (slug) VALUES ($1) ON CONFLICT DO NOTHING RETURNING slug',
          [revision],
        );
        if (claimed.rowCount) {
          const result = await client.query(
            "SELECT content FROM posts WHERE type = 'blog' AND slug = $1 FOR UPDATE",
            ['local-rag-ollama'],
          );
          const current = result.rows[0]?.content;
          if (typeof current !== 'string') throw new Error('Published RAG post is missing');
          if (!current.includes(filename)) {
            if (current.split(anchor).length !== 2) throw new Error('RAG section anchor changed; review before adding illustration');
            await client.query(
              "UPDATE posts SET content = $1, updated_at = now() WHERE type = 'blog' AND slug = $2",
              [current.replace(anchor, `${anchor}\n\n${resolveImages(illustration, directory)}`), 'local-rag-ollama'],
            );
          }
          console.log(`publish-repo-posts: ${filename} applied`);
        }
        await client.query('COMMIT');
      } catch (error) {
        await client.query('ROLLBACK');
        throw error;
      }
    }
  } finally {
    await client.end();
  }
}
