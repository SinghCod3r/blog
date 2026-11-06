import { getPostBySlug, getAllPostSlugs } from '../../../lib/posts';
import { generateSEO, generateArticleJSONLD, SITE_URL } from '../../../lib/seo';
import ArticleLayout from '../../../components/ArticleLayout';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  const url = `${SITE_URL}/posts/${slug}/`;

  return generateSEO({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    canonicalUrl: url,
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.updated,
    tags: post.frontmatter.tags,
    type: 'article',
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleJSONLD(post.frontmatter, slug)) }}
      />

      <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
        <nav className="mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-caption font-mono text-muted" role="list">
            <li>
              <a href="/" className="hover:text-lime transition-colors">Home</a>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <a href="/" className="hover:text-lime transition-colors">Articles</a>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-paper/50">{post.frontmatter.title}</li>
          </ol>
        </nav>

        <ArticleLayout post={post} />
      </div>
    </>
  );
}