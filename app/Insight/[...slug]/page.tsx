import { notFound } from 'next/navigation';
import { getInsightPage } from '@/lib/posts';
import InsightPostContent from '@/components/insight/InsightPostContent';
import { siteConfig } from '@/config/site';
import { absoluteUrl, serializeJsonLd, socialImages } from '@/lib/seo';
import type { Metadata } from 'next';
import readingTime from 'reading-time';
import '../../blog/[slug]/brunch.css';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = await getInsightPage(decoded);
  if (!page) return {};
  const url = absoluteUrl(`/Insight/${decoded.map(encodeURIComponent).join('/')}/`);
  const images = socialImages(page.heroImage, `${page.title} 대표 이미지`);

  return {
    title: page.title,
    description: page.description,
    keywords: [...(page.tags ?? []), '에세이', '정해영', 'hae02y'],
    openGraph: {
      type: 'article',
      locale: 'ko_KR',
      siteName: siteConfig.title,
      title: page.title,
      description: page.description,
      url,
      publishedTime: page.date ? new Date(page.date).toISOString() : undefined,
      authors: [siteConfig.author.name],
      tags: page.tags,
      images,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: images.map(({ url: imageUrl }) => imageUrl),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function InsightDetailPage({ params }: { params: { slug: string[] } }) {
  const decoded = params.slug.map(s => decodeURIComponent(s));
  const page = await getInsightPage(decoded);
  if (!page) notFound();
  const url = absoluteUrl(`/Insight/${decoded.map(encodeURIComponent).join('/')}/`);
  const image = socialImages(page.heroImage, `${page.title} 대표 이미지`)[0].url;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${url}#article`,
    mainEntityOfPage: url,
    headline: page.title,
    description: page.description,
    image: [image],
    ...(page.date ? {
      datePublished: new Date(page.date).toISOString(),
      dateModified: new Date(page.date).toISOString(),
    } : {}),
    inLanguage: 'ko-KR',
    keywords: page.tags,
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about/`,
    },
    publisher: {
      '@type': 'Person',
      '@id': `${siteConfig.url}#person`,
      name: siteConfig.author.name,
      url: `${siteConfig.url}/about/`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(jsonLd) }}
      />
      <InsightPostContent page={page} readingTime={Math.ceil(readingTime(page.content).minutes)} />
    </>
  );
}
