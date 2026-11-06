import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import type { Post, PostFrontmatter, Heading } from './types';
import { formatDate, calculateReadingTime } from './utils';

export * from './types';
export * from './utils';

const postsDirectory = path.join(process.cwd(), 'content/posts');

function getPostFiles(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory).filter(file => file.endsWith('.md'));
}

export function getAllPostSlugs(): string[] {
  const files = getPostFiles();
  return files.map(file => file.replace(/\.md$/, ''));
}

export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(postsDirectory, `${slug}.md`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContent);

  const frontmatter = data as PostFrontmatter;

  // Process markdown to HTML
  const processor = remark()
    .use(remarkHtml)
    .use(remarkGfm);

  const htmlContent = processor.processSync(content).toString();

  // Extract headings for TOC
  const headings = extractHeadings(content);

  return {
    slug,
    frontmatter,
    content,
    htmlContent,
    headings,
  };
}

function extractHeadings(markdown: string): Heading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');
    headings.push({ level, text, id });
  }

  return headings;
}

export function getAllPosts(): Post[] {
  const slugs = getAllPostSlugs();
  const posts = slugs
    .map(slug => getPostBySlug(slug))
    .filter((post): post is Post => post !== null)
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime());

  return posts;
}

export function getFeaturedPost(): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.frontmatter.featured) || posts[0] || null;
}

export function getPostsByCategory(category: string): Post[] {
  return getAllPosts().filter(post => post.frontmatter.category === category);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter(post => post.frontmatter.tags.includes(tag));
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = new Set(posts.map(post => post.frontmatter.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = new Set(posts.flatMap(post => post.frontmatter.tags));
  return Array.from(tags).sort();
}