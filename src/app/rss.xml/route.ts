import { getAllPosts } from '../../lib/posts';
import { SITE_URL, AUTHOR_NAME, AUTHOR_URL } from '../../lib/seo';
import RSS from 'rss';

export async function GET() {
  const posts = getAllPosts();

  const feed = new RSS({
    title: 'Ayush Singh — Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
    site_url: SITE_URL,
    feed_url: `${SITE_URL}/rss.xml`,
    language: 'en',
    copyright: `All rights reserved ${new Date().getFullYear()}, Ayush Singh`,
    categories: ['Open Source', 'Linux', 'Debugging', 'Systems Programming'],
  });

  posts.forEach((post) => {
    const url = `${SITE_URL}/posts/${post.slug}/`;
    feed.item({
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url,
      guid: url,
      date: post.frontmatter.updated || post.frontmatter.date,
      author: AUTHOR_NAME,
      categories: post.frontmatter.tags,
      enclosure: post.frontmatter.cover ? { url: post.frontmatter.cover } : undefined,
    });
  });

  const xml = feed.xml({ indent: true });

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

export const dynamic = 'force-static';
export const revalidate = false;