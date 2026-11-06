import { generateSEO, generateWebsiteJSONLD, SITE_URL } from "../lib/seo";
import { getAllPosts, getFeaturedPost, Post } from "../lib/posts";
import { Metadata } from "next";
import ClientHomePage from "./ClientHomePage";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Technical Writings",
    description: "Notes from building, debugging and contributing to real software.",
    canonicalUrl: SITE_URL,
  }),
  openGraph: {
    title: "Technical Writings",
    description: "Notes from building, debugging and contributing to real software.",
    url: SITE_URL,
    type: "website",
  },
};

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const otherPosts = featuredPost ? posts.filter((p) => p.slug !== featuredPost.slug) : posts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteJSONLD()) }}
      />
      <ClientHomePage posts={posts} featuredPost={featuredPost} otherPosts={otherPosts} />
    </>
  );
}