import { getPostBySlug, getAllPostSlugs } from "../../../lib/posts";
import { generateSEO, generateArticleJSONLD, SITE_URL } from "../../../lib/seo";
import ClientPostPage from "./ClientPostPage";
import type { Metadata } from "next";

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
    return { title: "Not Found" };
  }

  const url = `${SITE_URL}/posts/${slug}/`;

  return generateSEO({
    title: post.frontmatter.title,
    description: post.frontmatter.description,
    canonicalUrl: url,
    publishedTime: post.frontmatter.date,
    modifiedTime: post.frontmatter.updated,
    tags: post.frontmatter.tags,
    type: "article",
  });
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#07080a] text-[#f0f0e9]">
        <div className="text-center">
          <h1 className="text-4xl font-display font-medium mb-4">Article Not Found</h1>
          <a href="/" className="text-lime hover:underline">Back to Articles</a>
        </div>
      </main>
    );
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateArticleJSONLD(post.frontmatter, slug)) }}
      />
      <ClientPostPage post={post} slug={slug} />
    </>
  );
}