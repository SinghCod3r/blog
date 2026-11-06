import { Metadata } from "next";
import { getAllPosts } from "../lib/posts";
import BlogView from "../components/BlogView";

export const metadata: Metadata = {
  title: "Technical Writings",
  description: "Notes from building, debugging and contributing to real software.",
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": "/rss.xml",
    },
  },
  openGraph: {
    title: "Technical Writings",
    description: "Notes from building, debugging and contributing to real software.",
    url: "https://singhcod3r.github.io/blog/",
    type: "website",
  },
};

export default async function HomePage() {
  const posts = getAllPosts();

  return <BlogView initialPosts={posts} />;
}