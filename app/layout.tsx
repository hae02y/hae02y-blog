import type { Metadata } from 'next';
import ThemeProvider from '@/components/ThemeProvider';
import Navbar from '@/components/Navbar';
import { siteConfig } from '@/config/site';
import { defaultSocialImage, serializeJsonLd } from '@/lib/seo';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'hae02y | 정해영 기술블로그',
    template: `%s | ${siteConfig.title}`,
  },
  description: 'hae02y(정해영)의 기술블로그. Java, Spring Boot, 백엔드, 인프라, DevOps와 AI를 다루며 직접 개발하고 운영한 경험을 기록합니다.',
  keywords: [
    '정해영', '개발자 정해영', '정해영 개발자', '정해영 백엔드', '백엔드 정해영', '정해영 백엔드 개발자', '정해영 이력서', '정해영 포트폴리오',
    'hae02y', 'hae02y 개발자', 'hae02y blog', 'hae02y developer', 'hae02y portfolio',
    '백엔드 개발자', 'Backend Engineer', 'Software Engineer',
    '기술 블로그', '개발자 블로그', '개발 블로그',
    'Java', 'Kotlin', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis',
    'AWS', 'Docker', 'Kubernetes', 'NCP', 'CI/CD', 'DevOps', 'Cloud',
    'MySQL', 'Redis', 'PostgreSQL', 'MariaDB',
    'AI', 'MLOps', 'FastAPI', 'Python',
    'React', 'Next.js', 'TypeScript', 'TailwindCSS',
    'MSA', '마이크로서비스', '시스템 설계', '코드 리뷰',
  ],
  authors: [{ name: '정해영', url: siteConfig.url }],
  creator: '정해영',
  publisher: '정해영',
  alternates: {
    types: {
      'application/rss+xml': `${siteConfig.url}/rss.xml`,
      'application/atom+xml': `${siteConfig.url}/atom.xml`,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    url: `${siteConfig.url}/`,
    siteName: siteConfig.title,
    title: 'hae02y | 정해영 기술블로그',
    description: 'hae02y(정해영)의 기술블로그. 백엔드, 인프라, DevOps, AI를 직접 개발하고 운영하며 얻은 경험을 기록합니다.',
    images: [defaultSocialImage],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'hae02y | 정해영 기술블로그',
    description: 'hae02y(정해영)의 기술블로그. 백엔드, 인프라, DevOps, AI 개발과 운영 경험을 기록합니다.',
    images: [defaultSocialImage.url],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'sAUHghg81eclefIthjNm4YeM-XmjlM5HeCADnR8dKOA',
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.url}#website`,
      url: `${siteConfig.url}/`,
      name: 'Hae02y Devlog',
      alternateName: ['hae02y', '정해영 기술블로그'],
      description: '정해영(hae02y)의 Software Weaver 기술 블로그와 ABOUT, Portfolio',
      inLanguage: 'ko',
      publisher: { '@id': `${siteConfig.url}#person` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteConfig.url}/search/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
    {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: '정해영',
      givenName: '해영',
      familyName: '정',
      alternateName: ['hae02y', 'Haeyoung Jeong', '개발자 정해영', '정해영 개발자', '백엔드 정해영'],
      jobTitle: 'Software Weaver',
      description: 'Java, Spring Boot, AWS, Kubernetes, AI/인프라 기반 시스템을 설계하고 운영하는 Software Weaver',
      url: `${siteConfig.url}/about/`,
      image: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/img/me.jpg`,
        width: 800,
        height: 800,
      },
      email: siteConfig.author.email,
      sameAs: [
        siteConfig.links.github,
        siteConfig.links.linkedin,
        `mailto:${siteConfig.author.email}`,
        siteConfig.links.wikidocs,
      ],
      knowsAbout: [
        'Java', 'Spring Boot', 'Spring Security', 'JPA', 'MyBatis',
        'AWS', 'NCP', 'Docker', 'Kubernetes', 'MySQL', 'Redis',
        'CI/CD', 'DevOps', 'Backend Development', 'Infra', 'AI', 'MLOps',
      ],
    },
    {
      '@type': 'Blog',
      '@id': `${siteConfig.url}#blog`,
      name: 'Hae02y Devlog',
      description: '백엔드, 인프라, DevOps 기술 블로그',
      url: `${siteConfig.url}/blog/`,
      inLanguage: 'ko',
      author: { '@id': `${siteConfig.url}#person` },
      publisher: {
        '@type': 'Organization',
        name: 'Hae02y Devlog',
        logo: { '@type': 'ImageObject', url: `${siteConfig.url}/img/me.jpg` },
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/img/sitelogo.ico" />
        <link rel="alternate" type="application/rss+xml" title="정해영 기술블로그 RSS" href="/rss.xml" />
        <link rel="alternate" type="application/atom+xml" title="정해영 기술블로그 Atom" href="/atom.xml" />
        <link rel="sitemap" type="application/xml" href="/sitemap.xml" />
        <meta name="naver-site-verification" content="b0b393149cbaa4e924b020c1ae71ea17d4b94db1" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <div className="main-wrapper">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}
