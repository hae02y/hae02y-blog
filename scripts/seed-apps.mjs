/** Create the app launcher table and preserve the two previously published apps. */
import pg from 'pg';

if (!process.env.DATABASE_URL) {
  console.log('seed-apps: DATABASE_URL 없음 → 스킵');
} else {
  const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
  try {
    await client.connect();
    await client.query(`
      CREATE TABLE IF NOT EXISTS apps (
        id serial PRIMARY KEY,
        name text NOT NULL,
        short_name text NOT NULL,
        description text NOT NULL DEFAULT '',
        href text NOT NULL,
        category text NOT NULL DEFAULT 'WEB APP',
        icon text NOT NULL DEFAULT 'app',
        icon_image text,
        sort_order integer NOT NULL DEFAULT 0,
        published boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS apps_href_idx ON apps (href);
      CREATE INDEX IF NOT EXISTS apps_sort_order_idx ON apps (sort_order);
    `);

    const existing = await client.query('SELECT count(*)::int AS count FROM apps');
    if (existing.rows[0].count === 0) {
      await client.query(`
        INSERT INTO apps (name, short_name, description, href, category, icon, sort_order)
        VALUES
          ('HundredApp', 'Hundred', '룰렛과 랜덤 선택 기능을 담은 멀티테넌트 웹앱', 'https://hundred-app.vercel.app/', 'WEB APP', 'dice', 0),
          ('Hae02y Lab', 'Lab', '바이브코딩 아이디어를 만들고 시험하는 연구소', 'https://ground.hae02y.me/', 'LAB', 'flask', 1)
        ON CONFLICT (href) DO NOTHING
      `);
      console.log('seed-apps: 기존 공개 앱 2개 저장');
    } else {
      console.log(`seed-apps: ${existing.rows[0].count}개 기존 앱 유지`);
    }
  } finally {
    await client.end();
  }
}
