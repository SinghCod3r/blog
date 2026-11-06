"use client";

import { useEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ExternalLink, Clock, ArrowUpRight } from "lucide-react";
import { GithubIcon } from "../../../components/Icons";
import type { Post } from "../../../lib/posts";

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

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      "Open Source": "#a786ff",
      "OpenPrinting": "#7ff3da",
      "AI & Security": "#d8ff58",
      "Linux Systems": "#ff806d",
      "Python": "#7ff3da",
      "Web Development": "#d8ff58",
    };
    return colors[category] || "#d8ff58";
  };

  const accentHex = getCategoryColor(post.frontmatter.category);
  const { frontmatter, htmlContent, headings, content } = post;
  const readingTime = frontmatter.readingTime || `${Math.max(3, Math.ceil(content.length / 200 / 200))} min read`;

  return (
    <>
      {/* Ambient background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b from-[#d8ff58]/[0.05] via-[#a786ff]/[0.02] to-transparent blur-[130px]" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-[#7ff3da]/[0.02] blur-[140px]" />
      </div>

      {/* Top Navigation Bar - matching BlogView style */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-2xl bg-[#07080a]/85 border-b border-white/[0.08]">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-8 h-16 sm:h-20 flex items-center justify-between gap-3">
          {/* Back to Blog Link */}
          <Link
            href="/blog/"
            className="group inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-[#d8ff58]/40 text-xs sm:text-sm font-mono text-[#f0f0e9] transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft className="w-4 h-4 text-[#d8ff58] transition-transform duration-200 group-hover:-translate-x-1" />
            <span>Blog</span>
          </Link>

          {/* Right: Portfolio & GitHub */}
          <div className="flex items-center gap-2">
            <a
              href="https://singhcod3r.github.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-[#a786ff] text-[#f0f0e9] hover:text-[#07080a] text-xs sm:text-sm font-mono transition-all duration-200 active:scale-95 shrink-0"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Portfolio</span>
            </a>
            <a
              href="https://github.com/OpenPrinting/system-config-printer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-[#d8ff58] text-[#f0f0e9] hover:text-[#07080a] text-xs sm:text-sm font-mono transition-all duration-200 active:scale-95 shrink-0"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View on GitHub</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        <article className="prose-custom" itemScope itemType="https://schema.org/TechArticle">
          <header className="mb-12 md:mb-16 article-header-reveal">
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span
                className="px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-mono font-medium"
                style={{ color: accentHex, borderColor: `${accentHex}60` }}
              >
                {frontmatter.category}
              </span>
              <time
                itemProp="datePublished"
                className="text-xs font-mono text-[#989c99]"
                dateTime={frontmatter.date}
              >
                {new Date(frontmatter.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              {frontmatter.updated && (
                <time
                  itemProp="dateModified"
                  className="text-xs font-mono text-[#989c99]"
                  dateTime={frontmatter.updated}
                >
                  Updated {new Date(frontmatter.updated).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </time>
              )}
              <span className="text-xs font-mono text-[#989c99]">{readingTime}</span>
            </div>

            <h1 itemProp="headline" className="text-3xl sm:text-5xl md:text-6xl font-display font-semibold tracking-tight text-[#f0f0e9] mb-6">
              {frontmatter.title}
            </h1>

            <p itemProp="description" className="text-lg text-[#989c99] max-w-3xl mb-8 font-light leading-relaxed">
              {frontmatter.description}
            </p>

            <div className="flex flex-wrap gap-2" role="list" aria-label="Tags">
              {frontmatter.tags.map((tag) => (
                <span key={tag} className="text-xs font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[#f0f0e9]/80" role="listitem">
                  {tag}
                </span>
              ))}
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_260px] gap-12 lg:gap-16">
            <div className="min-w-0">
              <div
                className="prose-custom"
                itemProp="articleBody"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>

            <aside className="hidden lg:block sticky top-28">
              <nav className="rounded-2xl border border-white/10 bg-[#121316]/50 backdrop-blur-[20px] p-5 shadow-lg">
                <h4 className="text-xs font-mono uppercase tracking-wider text-[#989c99] mb-3">
                  Table of Contents
                </h4>
                {headings.length > 0 ? (
                  <ul className="space-y-2">
                    {headings.map((heading) => (
                      <li key={heading.id}>
                        <a
                          href={`#${heading.id}`}
                          className={`text-xs font-display transition-colors hover:text-[#d8ff58] ${
                            heading.level === 3 ? "ml-4 text-[#989c99]" : "font-medium text-[#f0f0e9]"
                          }`}
                        >
                          {heading.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-[#989c99]">No headings</p>
                )}
              </nav>
            </aside>
          </div>

          <footer className="mt-16 pt-8 border-t border-white/10">
            {/* Author Section */}
            <div className="mb-10 p-6 rounded-2xl border border-white/10 bg-[#121316]/75 backdrop-blur-[24px]">
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d8ff58] shadow-[0_0_15px_rgba(216,255,88,0.25)] shrink-0">
                  <Image
                    src="/blog/avatar_article.webp"
                    alt="Ayush Singh"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d8ff58] ring-2 ring-[#07080a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-lg font-display font-bold text-white">Ayush Singh</span>
                    <span className="text-xs font-mono text-[#d8ff58] tracking-wider uppercase">OpenPrinting Maintainer</span>
                  </div>
                  <p className="text-sm text-[#989c99] font-light max-w-xs">
                    CSE graduate and Open Source contributor working across Linux, Python, web technologies and developer tooling.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href="https://github.com/SinghCod3r"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://singhcod3r.github.io/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#a786ff] transition-all active:scale-95"
                    aria-label="Portfolio"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

            {/* Back to Articles */}
            <nav className="flex items-center justify-start" aria-label="Article navigation">
              <Link
                href="/blog/"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-[#f0f0e9] font-mono text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 group"
              >
                <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Articles
              </Link>
            </nav>
          </footer>
        </article>
      </main>

      {/* Footer */}
      <footer className="mt-16 sm:mt-24 border-t border-white/10 py-8 px-4 sm:px-8 text-center text-xs font-mono text-[#989c99]">
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 Ayush Singh. All writings on{" "}
            <a
              href="https://singhcod3r.github.io/blog/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#d8ff58] hover:underline"
            >
              Technical Writings
            </a>
            .
          </p>
          <a
            href="https://singhcod3r.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#d8ff58] hover:underline inline-flex items-center gap-1"
          >
            <span>← Return to Portfolio</span>
          </a>
        </div>
      </footer>
    </>
  );
}