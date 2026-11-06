"use client";

import { useEffect, useState, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  ChevronDown,
  X,
  BookOpen,
  ArrowUpRight,
} from "lucide-react";
import { GithubIcon } from "../../../components/Icons";
import type { Post } from "../../../lib/posts";

gsap.registerPlugin(ScrollTrigger);

interface ClientPostPageProps {
  post: Post;
  slug: string;
}

export default function ClientPostPage({ post, slug }: ClientPostPageProps) {
  const [introDone, setIntroDone] = useState(false);
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);

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

  // Click outside & Escape key listeners for nav
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsNavExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsNavExpanded(false);
      }
    };

    if (isNavExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isNavExpanded]);

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

      {/* Dynamic Island Navigation */}
      <div
        onClick={() => setIsNavExpanded(true)}
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none will-change-transform ${
          introDone
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 -translate-y-10 pointer-events-none scale-95"
        }`}
      >
        {!isNavExpanded ? (
          /* COMPACT DYNAMIC ISLAND STATE */
          <div
            ref={islandRef}
            className="group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#08090c]/92 hover:bg-[#0c0d12] backdrop-blur-2xl border border-white/15 hover:border-[#d8ff58]/40 shadow-[0_12px_36px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 active:scale-95"
            role="button"
            aria-label="Open navigation"
          >
            {/* Specular Top Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Circular Profile Avatar */}
            <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full overflow-hidden border border-white/25 group-hover:border-[#d8ff58] transition-colors shrink-0">
              <Image
                src="/blog/avatar_dynamic_island.webp"
                alt="Ayush Singh"
                fill
                sizes="28px"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
                unoptimized
              />
              <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-[#d8ff58] ring-1 ring-black" />
            </div>

            {/* Section Name */}
            <span className="inline-flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)]">
              Article
            </span>

            {/* Expand Indicator */}
            <div className="flex items-center gap-1 pl-0.5 text-[#989c99] group-hover:text-[#d8ff58] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d8ff58] shadow-[0_0_6px_#d8ff58] animate-pulse" />
              <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:translate-y-0.5" />
            </div>
          </div>
        ) : (
          /* EXPANDED DYNAMIC ISLAND STATE */
          <div
            ref={islandRef}
            className="w-[92vw] max-w-[340px] sm:max-w-[380px] rounded-3xl bg-[#090a0e]/95 backdrop-blur-3xl border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.9)] p-4 sm:p-5 flex flex-col gap-3.5 animate-island-expand"
          >
            {/* Specular Top Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-3xl bg-gradient-to-r from-transparent via-[#d8ff58]/60 to-transparent" />

            {/* Top Bar: Profile Details & Close Button */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#d8ff58] shadow-[0_0_15px_rgba(216,255,88,0.25)] shrink-0">
                  <Image
                    src="/blog/avatar_dynamic_island.webp"
                    alt="Ayush Singh"
                    fill
                    sizes="48px"
                    className="object-cover"
                    unoptimized
                  />
                  <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-[#d8ff58] ring-1.5 ring-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-display font-bold text-white tracking-wide">
                    Ayush Singh
                  </span>
                  <span className="text-[10px] font-mono text-[#d8ff58] tracking-wider uppercase">
                    OpenPrinting Maintainer
                  </span>
                </div>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setIsNavExpanded(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-90"
                aria-label="Close navigation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation Options */}
            <nav className="flex flex-col gap-1 py-1">
              <Link
                href="https://singhcod3r.github.io/"
                onClick={() => setIsNavExpanded(false)}
                className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 active:scale-[0.98] hover:bg-white/[0.04] text-[#989c99] hover:text-[#f0f0e9]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-white/35 group-hover/item:text-[#d8ff58] transition-colors">
                    01
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider uppercase transition-colors group-hover/item:text-white">
                    Portfolio
                  </span>
                </div>
                <span className="text-xs text-white/30 group-hover/item:text-white/80 transition-transform duration-200 group-hover/item:translate-x-0.5">
                  →
                </span>
              </Link>

              <Link
                href="/"
                onClick={() => setIsNavExpanded(false)}
                className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 active:scale-[0.98] hover:bg-white/[0.04] text-[#989c99] hover:text-[#f0f0e9]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-white/35 group-hover/item:text-[#d8ff58] transition-colors">
                    02
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider uppercase transition-colors group-hover/item:text-white">
                    Blog
                  </span>
                </div>
                <span className="text-xs text-white/30 group-hover/item:text-white/80 transition-transform duration-200 group-hover/item:translate-x-0.5">
                  →
                </span>
              </Link>

              <Link
                href="https://github.com/SinghCod3r"
                onClick={() => setIsNavExpanded(false)}
                className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 active:scale-[0.98] hover:bg-white/[0.04] text-[#989c99] hover:text-[#f0f0e9]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-white/35 group-hover/item:text-[#d8ff58] transition-colors">
                    03
                  </span>
                  <span className="font-mono text-xs font-bold tracking-wider uppercase transition-colors group-hover/item:text-white">
                    GitHub
                  </span>
                </div>
                <span className="text-xs text-white/30 group-hover/item:text-white/80 transition-transform duration-200 group-hover/item:translate-x-0.5">
                  →
                </span>
              </Link>
            </nav>

            {/* Actions: Portfolio, Blog & GitHub */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
              <a
                href="https://singhcod3r.github.io/"
                onClick={() => setIsNavExpanded(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <BookOpen className="w-3 h-3 text-[#a786ff]" />
                <span>Portfolio</span>
              </a>

              <a
                href="/"
                onClick={() => setIsNavExpanded(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <BookOpen className="w-3 h-3 text-[#d8ff58]" />
                <span>Blog</span>
              </a>

              <a
                href="https://github.com/SinghCod3r"
                onClick={() => setIsNavExpanded(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <GithubIcon className="w-3 h-3 text-[#d8ff58]" />
                <span>GitHub</span>
              </a>
            </div>
          </div>
        )}
      </div>

      <main className="w-full max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-20 py-10 sm:py-16">
        <article className="prose-custom" itemScope itemType="https://schema.org/TechArticle">
          <header className="max-w-5xl mb-12 md:mb-16 article-header-reveal">
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

            <h1 itemProp="headline" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight text-[#f0f0e9] mb-6 leading-snug">
              {frontmatter.title}
            </h1>

            <p itemProp="description" className="text-base sm:text-lg text-[#989c99] max-w-3xl mb-8 font-light leading-relaxed">
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

          <div className="grid lg:grid-cols-[minmax(0,1fr)_280px] gap-10 lg:gap-20 xl:gap-28 items-start">
            <div className="min-w-0 max-w-[78ch] prose prose-invert prose-custom" itemProp="articleBody">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
              <div className="flex items-center gap-4 flex-wrap">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d8ff58] shadow-[0_0_15px_rgba(216,255,88,0.25)] shrink-0">
                  <Image
                    src="/blog/avatar_dynamic_island.webp"
                    alt="Ayush Singh"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d8ff58] ring-2 ring-[#07080a]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-3 mb-2 flex-wrap">
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
                    rel="noopener noreferrer"
                    className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
                    aria-label="GitHub"
                  >
                    <GithubIcon className="w-4 h-4" />
                  </a>
                  <a
                    href="https://singhcod3r.github.io/"
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
                href="/"
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
        <div className="w-full max-w-[1600px] mx-auto px-5 sm:px-10 lg:px-16 xl:px-20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>
            © 2026 Ayush Singh. All writings on{" "}
            <a
              href="https://singhcod3r.github.io/blog/"
              rel="noopener noreferrer"
              className="text-[#d8ff58] hover:underline"
            >
              Technical Writings
            </a>
            .
          </p>
          <a
            href="https://singhcod3r.github.io/"
            className="text-[#d8ff58] hover:underline inline-flex items-center gap-1"
          >
            <span>← Return to Portfolio</span>
          </a>
        </div>
      </footer>
    </>
  );
}