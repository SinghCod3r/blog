import { PostFrontmatter } from './posts';

export const SITE_URL = 'https://singhcod3r.github.io/blog';
export const SITE_NAME = 'Ayush Singh — Technical Writings';
export const SITE_DESCRIPTION = 'Notes from building, debugging and contributing to real software.';
export const AUTHOR_NAME = 'Ayush Singh';
export const AUTHOR_URL = 'https://github.com/SinghCod3r';
export const TWITTER_HANDLE = '@SinghCod3r';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  type?: 'website' | 'article';
}

export function generateSEO(props: SEOProps) {
  const {
    title,
    description,
    canonicalUrl,
    ogImage,
    publishedTime,
    modifiedTime,
    author = AUTHOR_NAME,
    tags = [],
    type = 'website',
  } = props;

  const fullTitle = `${title} | ${SITE_NAME}`;

  return {
    title: fullTitle,
    description,
    canonical: canonicalUrl,
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      type,
      locale: 'en_US',
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      authors: [author],
      tags,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export function generateArticleJSONLD(post: PostFrontmatter, slug: string) {
  const url = `${SITE_URL}/posts/${slug}/`;

  return {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    publisher: {
      '@type': 'Person',
      name: AUTHOR_NAME,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: post.category,
    keywords: post.tags.join(', '),
    wordCount: post.readingTime ? parseInt(post.readingTime) * 200 : undefined,
  };
}

export function generateWebsiteJSONLD() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      url: AUTHOR_URL,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}