import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowUpRight, Dices, FlaskConical } from 'lucide-react';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = {
  title: 'Apps by hae02y',
  description: 'hae02y가 만든 웹앱과 실험을 아이폰 홈 화면처럼 둘러보고 바로 열어보세요.',
  alternates: { canonical: `${siteConfig.url}/apps/` },
};

const apps = [
  {
    name: 'HundredApp',
    shortName: 'Hundred',
    description: '룰렛과 랜덤 선택 기능을 담은 멀티테넌트 웹앱',
    href: 'https://hundred-app.vercel.app/',
    category: 'WEB APP',
    icon: Dices,
    iconColor: 'from-violet-500 via-fuchsia-500 to-pink-500',
  },
  {
    name: 'Hae02y Lab',
    shortName: 'Lab',
    description: '바이브코딩 아이디어를 만들고 시험하는 연구소',
    href: 'https://ground.hae02y.me/',
    category: 'LAB',
    icon: FlaskConical,
    iconColor: 'from-cyan-400 via-sky-500 to-indigo-600',
  },
] as const;

export default function AppsPage() {
  return (
    <main className="mx-auto max-w-5xl px-4 pb-24 pt-16 text-[var(--primary)] md:pt-24">
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_390px] lg:gap-20">
        <div className="max-w-xl">
          <p className="mb-3 font-mono text-xs font-bold tracking-[0.22em] text-[var(--secondary)]">HAE02Y / APPS</p>
          <h1 className="mb-5 text-4xl font-bold tracking-tight sm:text-5xl">만든 앱들</h1>
          <p className="text-base leading-8 text-[var(--secondary)]">
            아이콘을 눌러 직접 만든 서비스를 열어보세요. 작은 실험부터 실제로 사용할 수 있는 웹앱까지 한곳에 모았습니다.
          </p>
          <div className="mt-8 flex gap-5 font-mono text-xs font-semibold tracking-wide">
            <Link href="/about/?tab=portfolio" className="underline underline-offset-4 hover:opacity-70">프로젝트 자세히 보기</Link>
            <Link href="/blog/" className="underline underline-offset-4 hover:opacity-70">개발 기록 읽기</Link>
          </div>
        </div>

        <section aria-label="앱 바로가기" className="mx-auto w-full max-w-[390px]">
          <div className="rounded-[3.4rem] border-[7px] border-slate-800 bg-slate-900 p-[5px] shadow-[0_32px_75px_-26px_rgba(0,0,0,0.55)] dark:border-slate-700">
            <div className="relative flex min-h-[610px] flex-col overflow-hidden rounded-[2.65rem] bg-gradient-to-br from-slate-900 via-indigo-950 to-fuchsia-950 p-6 text-white sm:min-h-[670px]">
              <div className="pointer-events-none absolute -right-28 top-20 h-72 w-72 rounded-full bg-fuchsia-500/25 blur-3xl" />
              <div className="pointer-events-none absolute -left-28 bottom-16 h-72 w-72 rounded-full bg-sky-500/25 blur-3xl" />

              <div className="relative z-10 flex items-start justify-between text-xs font-semibold">
                <span aria-hidden="true">9:41</span>
                <div aria-hidden="true" className="absolute left-1/2 top-[-10px] h-7 w-28 -translate-x-1/2 rounded-full bg-black" />
                <span aria-hidden="true" className="tracking-widest">●●● ▰</span>
              </div>

              <div className="relative z-10 mt-14 rounded-[1.6rem] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
                <p className="font-mono text-[10px] font-bold tracking-[0.24em] !text-white/65">MADE BY HAE02Y</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight !text-white">아이디어를 앱으로.</p>
                <p className="mt-1 text-sm !text-white/70">만들고, 써보고, 다시 고칩니다.</p>
              </div>

              <div className="relative z-10 mt-9 grid grid-cols-4 gap-x-3 gap-y-7">
                {apps.map(app => {
                  const Icon = app.icon;
                  return (
                    <a key={app.href} href={app.href} target="_blank" rel="noopener noreferrer" aria-label={`${app.name} 열기 (새 탭)`} className="group flex min-w-0 flex-col items-center gap-2 text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white">
                      <span className={`flex aspect-square w-full max-w-16 items-center justify-center rounded-[1.35rem] bg-gradient-to-br ${app.iconColor} text-white shadow-lg transition-transform duration-200 group-hover:-translate-y-1 group-active:scale-95`}>
                        <Icon size={30} strokeWidth={1.8} aria-hidden="true" />
                      </span>
                      <span className="w-full truncate text-[11px] font-medium !text-white drop-shadow">{app.shortName}</span>
                    </a>
                  );
                })}
              </div>

              <div className="relative z-10 mt-auto pt-10">
                <div className="mx-auto mb-5 flex w-fit gap-1.5" aria-hidden="true"><span className="h-1.5 w-1.5 rounded-full bg-white" /><span className="h-1.5 w-1.5 rounded-full bg-white/35" /></div>
                <div className="flex items-center justify-center gap-6 rounded-[1.6rem] border border-white/15 bg-white/15 p-3 backdrop-blur-xl">
                  <Link href="/" aria-label="블로그 홈" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-md transition-transform hover:-translate-y-1"><span className="font-mono text-lg font-bold">h.</span></Link>
                  <Link href="/blog/" aria-label="기술 글" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700 text-white shadow-md transition-transform hover:-translate-y-1"><span className="font-mono text-lg font-bold">T</span></Link>
                  <Link href="/about/?tab=portfolio" aria-label="포트폴리오" className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400 text-slate-900 shadow-md transition-transform hover:-translate-y-1"><span className="font-mono text-lg font-bold">P</span></Link>
                </div>
                <div className="mx-auto mt-5 h-1 w-28 rounded-full bg-white/90" aria-hidden="true" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section aria-labelledby="apps-list-title" className="mt-20 border-t border-black/10 pt-10 dark:border-white/10">
        <p className="mb-2 font-mono text-xs tracking-[0.22em] text-[var(--secondary)]">DIRECT LINKS</p>
        <h2 id="apps-list-title" className="mb-7 text-2xl font-bold">앱 바로가기</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {apps.map(app => {
            const Icon = app.icon;
            return (
              <a key={app.href} href={app.href} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-4 rounded-2xl border border-black/10 p-5 transition-colors hover:bg-black/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 dark:border-white/15 dark:hover:bg-white/5">
                <span className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-white ${app.iconColor}`}><Icon size={26} aria-hidden="true" /></span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.15em] text-[var(--secondary)]">{app.category}</span>
                  <span className="mt-1 block font-semibold">{app.name}</span>
                  <span className="mt-1 block text-sm leading-6 text-[var(--secondary)]">{app.description}</span>
                </span>
                <ArrowUpRight size={18} className="shrink-0 opacity-50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
              </a>
            );
          })}
        </div>
      </section>
    </main>
  );
}
