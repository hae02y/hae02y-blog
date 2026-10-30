import { siteConfig } from '@/config/site';
import { escapeXml, getRecentBlogFeedPosts } from '@/lib/xml-feed';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const posts = await getRecentBlogFeedPosts();
  const items = posts.map(post => {
    const url = `${siteConfig.url}/blog/${encodeURIComponent(post.slug)}/`;
    const published = post.date ? new Date(`${post.date}T00:00:00Z`) : post.createdAt;
    return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${published.toUTCString()}</pubDate>
      <description>${escapeXml(post.description || '')}</description>
      ${post.tags.map(tag => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
    </item>`;
  });
  const lastBuildDate = posts.reduce((latest, post) => Math.max(latest, post.updatedAt.getTime()), 0);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.title)}</title>
    <link>${siteConfig.url}/blog/</link>
    <description>${escapeXml(siteConfig.description)}</description>
    <language>ko</language>
    <lastBuildDate>${new Date(lastBuildDate || Date.now()).toUTCString()}</lastBuildDate>
    <atom:link href="${siteConfig.url}/rss.xml" rel="self" type="application/rss+xml"/>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
