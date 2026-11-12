'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';

const NAV_ITEMS = [
  { href: '/blog/', label: 'TECH' },
  { href: '/Insight/', label: 'ESSAY' },
  { href: '/about/', label: 'ABOUT', newTab: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [hidden, setHidden] = useState(false);
  const [lastY, setLastY] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 64 && y > lastY);
      setLastY(y);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [lastY]);

  // Hide navbar on full-screen portfolio and app routes — AFTER all hooks.
  if (pathname.startsWith('/about') || pathname.startsWith('/me') || pathname.startsWith('/en/about') || pathname === '/apps' || pathname === '/apps/') return null;

  return (
    <nav
      className={`navbar--fixed-top ${hidden ? 'navbar--hidden' : ''}`}
      style={{ height: 64, background: 'transparent' }}
    >
      <div className="flex items-center justify-between h-full max-w-5xl mx-auto px-4">
        <Link href="/" className="flex shrink-0 items-center gap-1 hover:opacity-80">
          <img src="/img/logo/whitemode.png" alt="Hae02y" className="h-10 md:h-11 block dark:hidden" />
          <img src="/img/logo/darkmode.png" alt="Hae02y" className="h-10 md:h-11 hidden dark:block" />
        </Link>

        <div className="flex min-w-0 items-center gap-0 sm:gap-1">
          {NAV_ITEMS.map(item => {
            const itemPath = item.href.replace(/\/$/, '');
            const active = !item.newTab && (pathname === item.href || pathname === itemPath || pathname.startsWith(`${itemPath}/`));

            return (
              <Link
                key={item.href}
                href={item.href}
                target={item.newTab ? '_blank' : undefined}
                rel={item.newTab ? 'noopener noreferrer' : undefined}
                aria-current={active ? 'page' : undefined}
                className={`border-b px-2 py-2 font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--primary)] transition-opacity hover:opacity-70 sm:px-3 sm:text-xs sm:tracking-[0.2em] ${
                  active ? 'border-[var(--primary)] opacity-100' : 'border-transparent opacity-55'
                }`}
              >
                {item.label}.
              </Link>
            );
          })}
          <form action="/search/" method="get" role="search" className="ml-1 hidden items-center md:flex">
            <label htmlFor="navbar-blog-search" className="sr-only">블로그 글 검색</label>
            <input
              id="navbar-blog-search"
              name="q"
              type="search"
              placeholder="SEARCH"
              className="h-8 w-24 border-b border-[var(--primary)] bg-transparent px-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--primary)] outline-none placeholder:opacity-45 focus:w-36 focus:border-b-2 lg:w-28"
            />
          </form>
          <Link
            href="/search/"
            aria-label="블로그 글 검색"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--primary)] opacity-60 transition-colors hover:bg-gray-100 hover:opacity-80 dark:hover:bg-gray-800 md:hidden"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-none stroke-current" strokeWidth="2" strokeLinecap="round">
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
          </Link>
          <a
            href="https://github.com/hae02y"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[var(--primary)] opacity-60 transition-colors hover:bg-gray-100 hover:opacity-80 dark:hover:bg-gray-800 sm:ml-1"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-[18px] w-[18px] fill-current">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.69-3.88-1.54-3.88-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.75 2.69 1.24 3.34.95.1-.74.4-1.24.73-1.53-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.47.11-3.06 0 0 .96-.31 3.16 1.18A10.93 10.93 0 0 1 12 5.99c.98 0 1.95.13 2.87.38 2.19-1.49 3.15-1.18 3.15-1.18.63 1.59.24 2.77.12 3.06.74.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.79.56A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>

          {mounted && (
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="ml-1 shrink-0 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 sm:ml-2"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
