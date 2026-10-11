'use client';

import { useRouter } from 'next/navigation';
import type { DocPage } from '@/lib/docs';
import { MarkdownRenderer } from '@/lib/markdown-renderer';
import ReadingProgress from '@/components/blog/ReadingProgress';
import { siteConfig } from '@/config/site';

interface InsightPostContentProps {
  page: DocPage;
  readingTime: number;
}

export default function InsightPostContent({ page, readingTime }: InsightPostContentProps) {
  const router = useRouter();
  const hasHeroImage = Boolean(page.heroImage);
  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <ReadingProgress />

      <article className="brunch-article">
        <header className={`brunch-header ${hasHeroImage ? 'brunch-header-hero' : ''}`}>
          {page.heroImage && (
            <div className="brunch-hero-backdrop" aria-hidden="true">
              <img src={page.heroImage} alt="" className="brunch-hero-backdrop-image" />
              <div className="brunch-hero-backdrop-overlay" />
            </div>
          )}
          <div className="brunch-header-inner">
            <div className="brunch-meta">
              <span>ESSAY</span>
              {page.date && (
                <>
                  <span className="brunch-meta-dot" />
                  <time dateTime={page.date}>{dateFormatter.format(new Date(page.date))}</time>
                </>
              )}
              <span className="brunch-meta-dot" />
              <span>{readingTime}분 분량</span>
            </div>
            <h1 className="brunch-title">{page.title}</h1>
            {page.description && <p className="brunch-subtitle">{page.description}</p>}
            {Boolean(page.tags?.length) && (
              <div className="brunch-tags">
                {page.tags?.map(tag => (
                  <span key={tag} className="brunch-tag">#{tag}</span>
                ))}
              </div>
            )}
          </div>
        </header>

        <div className="brunch-divider"><span /></div>

        <div className="brunch-content">
          <MarkdownRenderer content={page.content} assetBasePath={page.assetBasePath} />
        </div>

        <footer className="brunch-footer">
          <div className="brunch-divider"><span /></div>
          <div className="brunch-author">
            <img src={siteConfig.author.image} alt={siteConfig.author.name} className="brunch-author-img" />
            <div>
              <p className="brunch-author-name">{siteConfig.author.name}</p>
              <p className="brunch-author-desc">{siteConfig.author.bio}</p>
              <a
                href={siteConfig.links.wikidocs}
                target="_blank"
                rel="noopener noreferrer"
                className="brunch-author-link"
              >
                위키독스 저자 페이지 ↗
              </a>
            </div>
          </div>
          <button onClick={() => router.push('/Insight/')} className="brunch-back">
            ← ESSAY 목록으로 돌아가기
          </button>
        </footer>
      </article>
    </>
  );
}
