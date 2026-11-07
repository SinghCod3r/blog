import { Metadata } from "next";
import { getAllPosts } from "../lib/posts";
import BlogView from "../components/BlogView";

export const metadata: Metadata = {
  title: "Technical Writings",
  description: "Notes from building, debugging and contributing to real software.",
  alternates: {
    canonical: "/blog/",
    types: {
      "application/rss+xml": "/blog/rss.xml",
    },
  },
  openGraph: {
    title: "Technical Writings",
    description: "Notes from building, debugging and contributing to real software.",
    url: "https://singhcod3r.github.io/blog/",
    type: "website",
    images: [
      {
        url: "https://singhcod3r.github.io/hero_collage_desktop.webp",
        width: 1200,
        height: 630,
        alt: "Ayush Singh (SinghCod3r) Technical Writings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@SinghCod3r",
    creator: "@SinghCod3r",
    title: "Ayush Singh — Technical Writings",
    description: "Notes from building, debugging and contributing to real software.",
    images: ["https://singhcod3r.github.io/hero_collage_desktop.webp"],
  },
};

export default async function HomePage() {
  const posts = getAllPosts();

  return <BlogView initialPosts={posts} />;
}