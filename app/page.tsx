import type { Metadata } from 'next';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { getAllPosts } from '@/lib/posts';
import HomeClient from './HomeClient';

export const metadata: Metadata = {
  alternates: {
    canonical: `${siteConfig.url}/`,
  },
};

export const dynamic = 'force-dynamic';

export default async function Home() {
  const recentPosts = (await getAllPosts()).slice(0, 6);

  return (
    <main className="mx-auto max-w-5xl px-4 pb-20 text-[var(--primary)]">
      <section aria-labelledby="home-title" className="grid items-center gap-4 pt-12 md:grid-cols-2 md:gap-12 md:pt-20">
        <div>
          <p className="mb-4 font-mono text-sm text-[var(--secondary)]">HAE02Y / SOFTWARE WEAVER</p>
          <h1 id="home-title" className="text-3xl leading-tight md:text-4xl">정해영 기술블로그</h1>
          <p className="max-w-xl leading-relaxed text-[var(--secondary)]">
            코드와 인프라, 사람과 제품 사이를 엮습니다. 정해영(hae02y)이 Java, Spring Boot, AWS, Kubernetes, DevOps, AI로 제품을 만들고 운영하며 얻은 경험과 프로젝트를 기록합니다.
          </p>
          <nav aria-label="주요 페이지" className="mt-6 flex flex-wrap gap-6 text-sm underline underline-offset-4">
            <Link href="/blog/">기술 글</Link>
            <Link href="/Insight/">에세이</Link>
            <Link href="/about/">소개와 포트폴리오</Link>
          </nav>
          <a href="#recent-posts" className="mt-6 inline-block text-sm text-[var(--secondary)] underline underline-offset-4">최근 글 읽기 ↓</a>
        </div>
        <HomeClient />
      </section>

      <section aria-labelledby="recent-posts" className="mt-12 border-t border-solid border-black/10 pt-8 dark:border-white/10">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <h2 id="recent-posts" className="mb-0 scroll-mt-24">최근 기술 글</h2>
          <Link href="/blog/" className="shrink-0 text-sm underline underline-offset-4">전체 글 →</Link>
        </div>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          {recentPosts.map(post => (
            <article key={post.slug}>
              <time dateTime={post.date} className="font-mono text-xs text-[var(--secondary)]">{post.date}</time>
              <h3 className="mb-2 mt-2 text-lg">
                <Link href={`/blog/${post.slug}/`} className="hover:underline underline-offset-4">{post.title}</Link>
              </h3>
              <p className="text-sm leading-relaxed text-[var(--secondary)]">{post.description}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
