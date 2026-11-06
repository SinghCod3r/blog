"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DynamicIslandNav from "../../../components/DynamicIslandNav";
import MobileMenuDrawer from "../../../components/MobileMenuDrawer";
import ArticleLayout from "../../../components/ArticleLayout";
import type { Post } from "../../../lib/types";

gsap.registerPlugin(ScrollTrigger);

interface ClientPostPageProps {
  post: Post;
  slug: string;
}

export default function ClientPostPage({ post, slug }: ClientPostPageProps) {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroDone(true);
      return;
    }

    const isMobileOrTouch =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    if (!isMobileOrTouch) {
      gsap.ticker.lagSmoothing(500, 33);
    }

    // GSAP Kinetic Reveal for Article Header
    gsap.fromTo(
      ".article-header-reveal",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        stagger: 0.08,
        duration: 0.9,
        delay: 0.3,
        ease: "power3.out",
      }
    );

    // Bidirectional GSAP ScrollTrigger reveals on sections
    const reveals = gsap.utils.toArray<HTMLElement>(".reveal-element");
    reveals.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 35, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    setIntroDone(true);

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  const accentHex = post.frontmatter.category.toLowerCase().includes("open source") || post.frontmatter.category.toLowerCase().includes("linux")
    ? "#d8ff58"
    : post.frontmatter.category.toLowerCase().includes("debug")
    ? "#a786ff"
    : post.frontmatter.category.toLowerCase().includes("python")
    ? "#ff806d"
    : "#7ff3da";

  return (
    <>
      {/* Background Atmosphere */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(216,255,88,0.025) 0%, rgba(167,134,255,0.015) 40%, transparent 75%)"
      }} />

      {/* Dynamic Island Navigation */}
      <DynamicIslandNav visible={introDone} />

      {/* Mobile Menu Drawer */}
      <MobileMenuDrawer />

      <main className="relative min-h-screen bg-[#07080a] text-[#f0f0e9]">
        <div className="mx-auto max-w-7xl px-4 md:px-8 py-12 md:py-16">
          {/* Breadcrumb */}
          <nav className="article-header-reveal mb-8" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-xs font-mono text-muted" role="list">
              <li>
                <a href="/" className="hover:text-lime transition-colors">Home</a>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <a href="/" className="hover:text-lime transition-colors">Articles</a>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-paper/50 truncate max-w-[300px]">{post.frontmatter.title}</li>
            </ol>
          </nav>

          <ArticleLayout post={post} />
        </div>
      </main>
    </>
  );
}