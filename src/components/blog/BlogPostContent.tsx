'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type { BlogPost, BlogPostMeta, BlogPostNavigation } from '@/lib/blog';
import { MarkdownRenderer } from '@/lib/markdown-renderer';
import Comments from '@/components/Comments';
import ReadingProgress from './ReadingProgress';
import { siteConfig } from '@/config/site';

interface BlogPostContentProps {
  post: BlogPost;
  dirName?: string;
  navigation: BlogPostNavigation;
  relatedPosts: BlogPostMeta[];
}

export default function BlogPostContent({ post, dirName, navigation, relatedPosts }: BlogPostContentProps) {
  const router = useRouter();

  const dateFormatter = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <>
      <ReadingProgress />

      <article className="brunch-article">
        <header className="brunch-header">
          <div className="brunch-header-inner">
            <div className="brunch-meta">
              <time dateTime={post.date}>{dateFormatter.format(new Date(post.date))}</time>
              <span className="brunch-meta-dot" />
              <span>{post.readingTime}분 분량</span>
            </div>
            <h1 className="brunch-title">{post.title}</h1>
            {post.description && (
              <p className="brunch-subtitle">{post.description}</p>
            )}
            <div className="brunch-tags">
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}/`} className="brunch-tag">
                  #{tag}
                </Link>
              ))}
            </div>
          </div>
        </header>

        <div className="brunch-divider"><span /></div>

        <div className="brunch-content">
          <MarkdownRenderer content={post.content} dirName={dirName} />
        </div>

        <footer className="brunch-footer">
          <div className="brunch-divider"><span /></div>

          {relatedPosts.length > 0 && (
            <section className="brunch-related" aria-labelledby="related-posts-title">
              <p className="brunch-section-kicker">Related Flow</p>
              <h2 id="related-posts-title" className="brunch-section-title">같이보기</h2>
              <div className="brunch-related-list">
                {relatedPosts.map((related, index) => (
                  <Link key={related.slug} href={`/blog/${related.slug}/`} className="brunch-related-item">
                    <span className="brunch-related-number">{String(index + 1).padStart(2, '0')}</span>
                    <span className="brunch-related-body">
                      <span className="brunch-related-title">{related.title}</span>
                      <span className="brunch-related-meta">
                        {related.tags.slice(0, 3).join(' · ')} · {related.readingTime}분
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {(navigation.previous || navigation.next) && (
            <nav className="brunch-post-nav" aria-label="이전 다음 글">
              {navigation.previous ? (
                <Link href={`/blog/${navigation.previous.slug}/`} className="brunch-post-nav-card brunch-post-nav-prev">
                  <span className="brunch-post-nav-label">← 이전 글</span>
                  <span className="brunch-post-nav-title">{navigation.previous.title}</span>
                </Link>
              ) : <span />}
              {navigation.next ? (
                <Link href={`/blog/${navigation.next.slug}/`} className="brunch-post-nav-card brunch-post-nav-next">
                  <span className="brunch-post-nav-label">다음 글 →</span>
                  <span className="brunch-post-nav-title">{navigation.next.title}</span>
                </Link>
              ) : <span />}
            </nav>
          )}

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
          <div className="brunch-tags" style={{ justifyContent: 'center', marginTop: '1.5rem' }}>
            {post.tags.map(tag => (
              <Link key={tag} href={`/blog/tags/${encodeURIComponent(tag)}/`} className="brunch-tag">
                #{tag}
              </Link>
            ))}
          </div>
          <button onClick={() => router.push('/blog/')} className="brunch-back">
            ← TECH 목록으로 돌아가기
          </button>
          {post.comments && (
            <div className="brunch-comments">
              <Comments />
            </div>
          )}
        </footer>
      </article>
    </>
  );
}
