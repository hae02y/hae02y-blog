/** Create the app launcher table and publish verified SoloDev links once. */
import pg from 'pg';

const soloDevApps = [
  ['생존지침서', '생존지침서', '재난 대응 매뉴얼과 대비 도구를 모은 서비스', 'https://life.ha-e.com/', 'GUIDE', 'book', '/app-icons/survival-guide.jpg'],
  ['Leadbase', 'Leadbase', '사업장 데이터 탐색·견적 서비스 미리보기', 'https://leadbase-omega.vercel.app/', 'PREVIEW', 'briefcase', '/app-icons/leadbase.png'],
  ['Snap Cal', 'Snap Cal', '달력 중심 일정 관리 앱', 'https://snap-cal-snowy.vercel.app/', 'CALENDAR', 'calendar', '/app-icons/snap-cal.svg'],
  ['Letter to the World', 'Letter', '세계 지도에 편지를 보내고 발견하는 공간', 'https://letter-world.vercel.app/', 'SOCIAL', 'mail', '/app-icons/letter-world.svg'],
  ['Video Roulette', 'Roulette', '새로운 사람과 만나는 랜덤 화상 채팅', 'https://video-roulette.vercel.app/', 'SOCIAL', 'video', '/app-icons/video-roulette.svg'],
  ['칼퇴 계산기', '칼퇴', '오늘의 퇴근 시간을 계산하는 도구', 'https://off-work.vercel.app/', 'TOOL', 'clock', '/app-icons/off-work.svg'],
  ['Online Smoke', 'Smoke', '웹캠을 이용한 AR 담배 시뮬레이터', 'https://online-smoke.vercel.app/', 'EXPERIMENT', 'camera', '/app-icons/online-smoke.svg'],
  ['Void Glass', 'Void', '인터랙티브 3D 유리 파티클 아트', 'https://void-glass.vercel.app/', 'EXPERIMENT', 'sparkles', '/app-icons/void-glass.svg'],
  ['Object Scanner', 'Scanner', '브라우저에서 실행하는 실시간 객체 탐지', 'https://object-scanner-psi.vercel.app/', 'AI TOOL', 'scan', '/app-icons/object-scanner.svg'],
  ['Paper Translator', 'Paper', 'PDF 논문을 AI로 번역하는 도구', 'https://paper-translator-cyan.vercel.app/', 'AI TOOL', 'file', '/app-icons/paper-translator.svg'],
  ['ha-e.company', 'ha-e', '개발 스튜디오의 작업과 서비스를 소개하는 사이트', 'https://ha-e.com/', 'STUDIO', 'studio', '/app-icons/hae-company.png'],
];

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
        kind text NOT NULL DEFAULT '웹앱',
        platforms text[] NOT NULL DEFAULT ARRAY['Web']::text[],
        icon text NOT NULL DEFAULT 'app',
        icon_image text,
        sort_order integer NOT NULL DEFAULT 0,
        published boolean NOT NULL DEFAULT true,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      );
      CREATE UNIQUE INDEX IF NOT EXISTS apps_href_idx ON apps (href);
      CREATE INDEX IF NOT EXISTS apps_sort_order_idx ON apps (sort_order);
      ALTER TABLE apps ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT '웹앱';
      ALTER TABLE apps ADD COLUMN IF NOT EXISTS platforms text[] NOT NULL DEFAULT ARRAY['Web']::text[];
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

    await client.query('BEGIN');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS repo_app_detail_updates (
          batch text PRIMARY KEY,
          updated_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      const claimed = await client.query(
        'INSERT INTO repo_app_detail_updates (batch) VALUES ($1) ON CONFLICT DO NOTHING RETURNING batch',
        ['app-details-2026-11-09'],
      );
      if (claimed.rowCount) {
        const details = [
          ['https://hundred-app.vercel.app/', '웹앱', ['Web']],
          ['https://ground.hae02y.me/', '웹사이트', ['Web']],
          ['https://life.ha-e.com/', '웹사이트', ['Web']],
          ['https://leadbase-omega.vercel.app/', '웹앱', ['Web']],
          ['https://snap-cal-snowy.vercel.app/', '모바일 앱', ['Web', 'iOS', 'Android']],
          ['https://letter-world.vercel.app/', '웹앱', ['Web']],
          ['https://video-roulette.vercel.app/', '웹앱', ['Web']],
          ['https://off-work.vercel.app/', '웹앱', ['Web']],
          ['https://online-smoke.vercel.app/', '실험작', ['Web']],
          ['https://void-glass.vercel.app/', '실험작', ['Web']],
          ['https://object-scanner-psi.vercel.app/', '웹앱', ['Web']],
          ['https://paper-translator-cyan.vercel.app/', '웹앱', ['Web']],
          ['https://ha-e.com/', '웹사이트', ['Web']],
        ];
        for (const [href, kind, platforms] of details) {
          await client.query('UPDATE apps SET kind = $1, platforms = $2::text[] WHERE href = $3', [kind, platforms, href]);
        }
        console.log('seed-apps: 앱 종류·플랫폼 정보 반영');
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }

    await client.query('BEGIN');
    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS repo_app_publications (
          batch text PRIMARY KEY,
          published_at timestamptz NOT NULL DEFAULT now()
        )
      `);
      const claimed = await client.query(
        'INSERT INTO repo_app_publications (batch) VALUES ($1) ON CONFLICT DO NOTHING RETURNING batch',
        ['solo-dev-apps-2026-11-09'],
      );
      if (claimed.rowCount) {
        const result = await client.query('SELECT COALESCE(MAX(sort_order), -1)::int AS last_order FROM apps');
        let sortOrder = result.rows[0].last_order + 1;
        let inserted = 0;
        for (const [name, shortName, description, href, category, icon, iconImage] of soloDevApps) {
          const kind = category === 'GUIDE' || category === 'STUDIO' ? '웹사이트'
            : category === 'CALENDAR' ? '모바일 앱'
              : category === 'EXPERIMENT' ? '실험작' : '웹앱';
          const platforms = category === 'CALENDAR' ? ['Web', 'iOS', 'Android'] : ['Web'];
          const saved = await client.query(
            `INSERT INTO apps (name, short_name, description, href, category, icon, icon_image, kind, platforms, sort_order)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9::text[], $10)
             ON CONFLICT (href) DO NOTHING`,
            [name, shortName, description, href, category, icon, iconImage, kind, platforms, sortOrder++],
          );
          inserted += saved.rowCount;
        }
        console.log(`seed-apps: SoloDev 앱 ${inserted}개 추가`);
      } else {
        console.log('seed-apps: SoloDev 앱 게시 이미 처리됨');
      }
      await client.query('COMMIT');
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    }
  } finally {
    await client.end();
  }
}
