import { siteConfig } from '@/config/site';
import { escapeXml, getRecentBlogFeedPosts } from '@/lib/xml-feed';

export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const posts = await getRecentBlogFeedPosts();
  const entries = posts.map(post => {
    const url = `${siteConfig.url}/blog/${encodeURIComponent(post.slug)}/`;
    return `  <entry>
    <title>${escapeXml(post.title)}</title>
    <link href="${escapeXml(url)}"/>
    <id>${escapeXml(url)}</id>
    <published>${(post.date ? new Date(`${post.date}T00:00:00Z`) : post.createdAt).toISOString()}</published>
    <updated>${post.updatedAt.toISOString()}</updated>
    <summary>${escapeXml(post.description || '')}</summary>
    <author><name>${escapeXml(siteConfig.author.name)}</name></author>
    ${post.tags.map(tag => `<category term="${escapeXml(tag)}"/>`).join('\n    ')}
  </entry>`;
  });
  const updated = posts.reduce((latest, post) => Math.max(latest, post.updatedAt.getTime()), 0);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(siteConfig.title)}</title>
  <link href="${siteConfig.url}/blog/"/>
  <link href="${siteConfig.url}/atom.xml" rel="self"/>
  <id>${siteConfig.url}/blog/</id>
  <updated>${new Date(updated || Date.now()).toISOString()}</updated>
  <author><name>${escapeXml(siteConfig.author.name)}</name></author>
  <subtitle>${escapeXml(siteConfig.description)}</subtitle>
${entries.join('\n')}
</feed>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/atom+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
  });
}
