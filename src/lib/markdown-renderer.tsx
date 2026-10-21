'use client';

import { useState, useCallback, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { Highlight, themes } from 'prism-react-renderer';
import { useTheme } from 'next-themes';
import ImageViewer from '@/components/blog/ImageViewer';
import MermaidDiagram from '@/components/blog/MermaidDiagram';

function rewriteImageSrc(src: string | undefined, dirName?: string, assetBasePath?: string): string {
  if (!src) return '';
  if (src.startsWith('http') || src.startsWith('/')) return src;
  if (assetBasePath) return `${assetBasePath}/${src}`;
  if (dirName) return `/blog/${dirName}/${src}`;
  return src;
}

const COLLAPSE_THRESHOLD = 5;

const EMBED_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
  'player.vimeo.com',
]);

function safeMediaSrc(src: string | undefined, allowRelative = false): string | undefined {
  if (!src) return undefined;
  if (allowRelative && src.startsWith('/')) return src;

  try {
    const url = new URL(src);
    if (url.protocol !== 'https:') return undefined;
    return url.toString();
  } catch {
    return undefined;
  }
}

function safeEmbedSrc(src: string | undefined): string | undefined {
  const safeSrc = safeMediaSrc(src);
  if (!safeSrc) return undefined;

  try {
    return EMBED_HOSTS.has(new URL(safeSrc).hostname) ? safeSrc : undefined;
  } catch {
    return undefined;
  }
}

const CodeBlock = memo(function CodeBlock({ children, className }: { children: string; className?: string }) {
  const language = className?.replace('language-', '') || 'text';
  const code = String(children).replace(/\n$/, '');
  const lines = code.split('\n');
  const isLong = lines.length > COLLAPSE_THRESHOLD;
  const [expanded, setExpanded] = useState(!isLong);
  const [copied, setCopied] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const codeTheme = isDark ? themes.oneDark : themes.oneLight;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const toggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
  }, []);

  return (
    <div className={`code-block-wrapper ${isDark ? 'code-dark' : 'code-light'}`}>
      <div className="code-block-header">
        <span className="code-block-lang">{language}</span>
        <button onClick={handleCopy} className="code-block-copy">
          {copied ? '✓ 복사됨' : '복사'}
        </button>
      </div>

      <div className={`code-block-body ${!expanded ? 'code-collapsed' : ''}`}>
        <Highlight theme={codeTheme} code={code} language={language as any}>
          {({ style, tokens, getLineProps, getTokenProps }) => (
            <pre style={{ ...style, margin: 0, padding: '1rem 1.2rem', background: 'transparent', fontSize: '13.5px', lineHeight: 1.65, overflowX: 'auto' }}>
              <code>
                {tokens.map((line, i) => (
                  <div key={i} {...getLineProps({ line })}>
                    <span className="code-line-number">{i + 1}</span>
                    {line.map((token, key) => (
                      <span key={key} {...getTokenProps({ token })} />
                    ))}
                  </div>
                ))}
              </code>
            </pre>
          )}
        </Highlight>
      </div>

      {isLong && (
        <button onClick={toggleExpand} className="code-block-toggle">
          {expanded ? '접기 ▲' : `펼치기 (${lines.length}줄) ▼`}
        </button>
      )}
    </div>
  );
});

interface MarkdownRendererProps {
  content: string;
  dirName?: string;
  assetBasePath?: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({ content, dirName, assetBasePath }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      // Allow authored posts to use figure/figcaption, video and iframe markup.
      // The components below still validate external media URLs before rendering.
      rehypePlugins={[rehypeRaw]}
      components={{
        img: ({ src, alt }) => (
          <ImageViewer
            src={rewriteImageSrc(src, dirName, assetBasePath)}
            alt={alt || ''}
          />
        ),
        iframe: ({ src, title, ...props }) => {
          const safeSrc = safeEmbedSrc(src);
          if (!safeSrc) return null;

          return (
            <iframe
              {...props}
              src={safeSrc}
              title={title || 'Embedded video'}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="markdown-embed"
            />
          );
        },
        video: ({ src, children, ...props }) => {
          const safeSrc = safeMediaSrc(rewriteImageSrc(src, dirName, assetBasePath), true);
          return (
            <video {...props} src={safeSrc} controls preload="metadata" className="markdown-video">
              {children}
            </video>
          );
        },
        source: ({ src, ...props }) => {
          const safeSrc = safeMediaSrc(rewriteImageSrc(src, dirName, assetBasePath), true);
          if (!safeSrc) return null;
          return <source {...props} src={safeSrc} />;
        },
        figure: ({ className, ...props }) => (
          <figure {...props} className={`markdown-figure ${className || ''}`.trim()} />
        ),
        figcaption: ({ children, ...props }) => (
          <figcaption {...props} className="markdown-figcaption">{children}</figcaption>
        ),
        code: ({ children, className, node, ...props }) => {
          // Block code: has language- class OR is inside <pre> (multi-line)
          const isBlock = className?.startsWith('language-') ||
            String(children).includes('\n');
          if (className === 'language-mermaid') {
            return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
          }
          if (isBlock) {
            return <CodeBlock className={className}>{String(children)}</CodeBlock>;
          }
          return <code className="inline-code" {...props}>{children}</code>;
        },
        pre: ({ children }) => <>{children}</>,
        blockquote: ({ children }) => (
          <blockquote className="brunch-blockquote">{children}</blockquote>
        ),
        a: ({ href, children }) => (
          <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}>
            {children}
          </a>
        ),
        table: ({ children }) => (
          <div className="table-wrapper">
            <table>{children}</table>
          </div>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
});

// Keep backward compat
export function renderMarkdown(content: string, dirName?: string, assetBasePath?: string) {
  return <MarkdownRenderer content={content} dirName={dirName} assetBasePath={assetBasePath} />;
}
