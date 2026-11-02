import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import PhoneLauncher from '@/components/apps/PhoneLauncher';
import AppIcon from '@/components/apps/AppIcon';
import { siteConfig } from '@/config/site';
import { getPublishedApps } from '@/lib/apps';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Apps by hae02y',
  description: 'hae02y가 만든 앱을 인터랙티브한 홈 화면에서 둘러보고 바로 열어보세요.',
  alternates: { canonical: `${siteConfig.url}/apps/` },
};

export default async function AppsPage() {
  const apps = await getPublishedApps();
  const launcherApps = apps.map(({ id, name, shortName, description, href, category, icon, iconImage }) => ({ id, name, shortName, description, href, category, icon, iconImage }));

  return (
    <main className="mx-auto max-w-6xl px-4 pb-24 pt-14 text-[var(--primary)] md:pt-20">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_430px] lg:gap-16">
        <div className="mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <p className="mb-4 font-mono text-xs font-semibold tracking-[0.24em] text-[var(--secondary)]">HAE02Y / APP COLLECTION</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">만든 앱들</h1>
          <p className="text-base leading-8 text-[var(--secondary)]">아이폰 홈 화면처럼 앱을 둘러보세요. 아이콘에 마우스를 올리면 실행 화살표가 나타나고, 누르면 앱 화면이 열립니다. 모바일에서는 화면을 가득 채우고 가로 방향에서도 사용할 수 있습니다.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-5 font-mono text-xs font-semibold tracking-wide lg:justify-start">
            <Link href="/about/?tab=portfolio" className="underline underline-offset-4 hover:opacity-70">프로젝트 자세히 보기</Link>
            <Link href="/blog/" className="underline underline-offset-4 hover:opacity-70">개발 기록 읽기</Link>
          </div>
          <p className="mt-9 text-xs text-[var(--secondary)]">아이콘 열기 · 좌우 스와이프 · 아래로 검색 · 오른쪽 상단에서 제어 센터 · 위로 홈</p>
        </div>
        <PhoneLauncher apps={launcherApps} />
      </div>

      <section aria-labelledby="apps-list-title" className="mt-20 border-t border-black/10 pt-10 dark:border-white/10">
        <p className="mb-2 font-mono text-xs tracking-[0.22em] text-[var(--secondary)]">DIRECT LINKS</p>
        <h2 id="apps-list-title" className="mb-7 text-2xl font-bold">앱 바로가기</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {apps.map(app => (
            <a key={app.id} href={app.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-2xl border border-black/10 p-5 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/15 dark:hover:bg-white/5">
              <AppIcon icon={app.icon} image={app.iconImage} iconSize={26} className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl" />
              <span className="min-w-0 flex-1"><span className="block font-mono text-[10px] tracking-[0.15em] text-[var(--secondary)]">{app.category}</span><span className="mt-1 block font-semibold">{app.name}</span><span className="mt-1 block text-sm leading-6 text-[var(--secondary)]">{app.description}</span></span>
              <ArrowUpRight size={18} className="shrink-0 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
