import { getAllPosts, getAllPostSlugs } from '../../lib/posts';
import { SITE_URL } from '../../lib/seo';

interface SitemapRoute {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

export async function GET() {
  const posts = getAllPosts();
  const baseUrl = SITE_URL;

  const staticRoutes: SitemapRoute[] = [
    { url: baseUrl, changefreq: 'weekly', priority: 1.0 },
  ];

  const postRoutes: SitemapRoute[] = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.slug}/`,
    lastmod: post.frontmatter.updated || post.frontmatter.date,
    changefreq: 'monthly',
    priority: 0.8,
  }));

  const allRoutes = [...staticRoutes, ...postRoutes];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${allRoutes
  .map((route) => {
    let entry = `  <url>\n    <loc>${route.url}</loc>`;
    if (route.lastmod) {
      entry += `\n    <lastmod>${new Date(route.lastmod).toISOString().split('T')[0]}</lastmod>`;
    }
    if (route.changefreq) {
      entry += `\n    <changefreq>${route.changefreq}</changefreq>`;
    }
    if (route.priority !== undefined) {
      entry += `\n    <priority>${route.priority}</priority>`;
    }
    entry += `\n  </url>`;
    return entry;
  })
  .join('\n')}
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export const dynamic = 'force-static';
export const revalidate = false;