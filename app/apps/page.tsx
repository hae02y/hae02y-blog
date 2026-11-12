import type { Metadata, Viewport } from 'next';
import PhoneLauncher from '@/components/apps/PhoneLauncher';
import { siteConfig } from '@/config/site';
import { getPublishedApps } from '@/lib/apps';

export const dynamic = 'force-dynamic';

export const viewport: Viewport = {
  themeColor: '#030812',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  title: 'Apps by hae02y',
  description: 'hae02y가 만든 앱을 접이식 화면에서 둘러보고 바로 열어보세요.',
  alternates: { canonical: `${siteConfig.url}/apps/` },
};

export default async function AppsPage() {
  const apps = await getPublishedApps();
  const launcherApps = apps.map(({ id, name, shortName, description, href, category, kind, platforms, icon, iconImage, createdAt }) => ({
    id, name, shortName, description, href, category, kind, platforms, icon, iconImage, addedAt: createdAt.toISOString(),
  }));

  return (
    <main className="-mt-16 flex min-h-dvh items-center justify-center px-4 py-10">
      <h1 className="sr-only">만든 앱들</h1>
      <PhoneLauncher apps={launcherApps} />
    </main>
  );
}
