"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowLeft,
  ExternalLink,
  Clock,
  Rss,
  Search,
  ChevronDown,
  X,
  BookOpen,
} from "lucide-react";
import { GithubIcon } from "@/components/Icons";
import type { Post } from "@/lib/posts";

interface BlogViewProps {
  initialPosts: Post[];
}

export default function BlogView({ initialPosts }: BlogViewProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic Island Navigation state
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const [introDone, setIntroDone] = useState(false);
  const islandRef = useRef<HTMLDivElement>(null);

  // Get all unique categories
  const allCategories = Array.from(new Set(initialPosts.map(p => p.frontmatter.category))).sort();
  
  const categories = [
    { label: "All", count: initialPosts.length },
    ...allCategories.map(cat => ({
      label: cat,
      count: initialPosts.filter(p => p.frontmatter.category === cat).length,
    })),
  ];

  const filteredPosts = initialPosts.filter((post) => {
    const matchesCategory = activeCategory === "All" || post.frontmatter.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      query === "" ||
      post.frontmatter.title.toLowerCase().includes(query) ||
      (post.frontmatter.description?.toLowerCase().includes(query) ?? false) ||
      post.frontmatter.tags.some((t) => t.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  // Category color mapping
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

  // Entrance animations on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    gsap.registerPlugin(ScrollTrigger);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroDone(true);
      return;
    }

    const ctx = gsap.context(() => {
      // 1. Hero elements reveal
      gsap.fromTo(
        ".blog-hero-anim",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
        }
      );

      // 2. Filter bar entrance
      gsap.fromTo(
        ".blog-filter-bar",
        { y: 16, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: 0.2,
          ease: "power2.out",
        }
      );

      // 3. Sidebar entrance
      gsap.fromTo(
        ".blog-sidebar-card",
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          delay: 0.3,
          stagger: 0.12,
          ease: "power3.out",
        }
      );
    }, containerRef);

    setIntroDone(true);

    return () => ctx.revert();
  }, []);

  // Re-run card stagger animation when filter or search changes
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = gsap.utils.toArray<HTMLElement>(".blog-card");
    if (cards.length > 0) {
      gsap.fromTo(
        cards,
        { y: 20, opacity: 0, scale: 0.985 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.45,
          stagger: 0.06,
          ease: "power2.out",
          overwrite: "auto",
        }
      );
    }
  }, [activeCategory, searchQuery]);

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

  const handleCardClick = (url: string) => {
    if (typeof window !== "undefined") {
      window.location.href = url;
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-[#07080a] text-[#f0f0e9] selection:bg-[#d8ff58] selection:text-[#0c0d0e]"
    >
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
              Blog
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
                href="https://github.com/SinghCod3r"
                onClick={() => setIsNavExpanded(false)}
                className="group/item flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 active:scale-[0.98] hover:bg-white/[0.04] text-[#989c99] hover:text-[#f0f0e9]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-[10px] text-white/35 group-hover/item:text-[#d8ff58] transition-colors">
                    02
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

            {/* Actions: Portfolio & GitHub */}
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

      {/* Main Content Area */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-8 py-10 sm:py-16">
        {/* Hero Section */}
        <div className="mb-10 sm:mb-14">
          <div className="blog-hero-anim inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#d8ff58]/30 bg-[#d8ff58]/10 text-[#d8ff58] text-[11px] sm:text-xs font-mono uppercase tracking-widest mb-4">
            <Rss className="w-3.5 h-3.5 text-[#d8ff58]" />
            <span>Local Markdown Articles</span>
          </div>

          <h1 className="blog-hero-anim text-3xl sm:text-5xl lg:text-6xl font-display font-medium tracking-tight text-[#f0f0e9] mb-4">
            Technical Writings.
          </h1>

          <p className="blog-hero-anim text-sm sm:text-lg text-[#989c99] max-w-2xl font-light leading-relaxed">
            Notes from building, debugging and contributing to real software. Deep dives into Linux systems,
            open source contribution, developer tooling, and the craft of debugging complex software.
          </p>
        </div>

        {/* Filter Bar & Search */}
        <div className="blog-filter-bar flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 sm:mb-12">
          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  onClick={() => setActiveCategory(cat.label)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-mono transition-all duration-200 border whitespace-nowrap flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? "bg-[#d8ff58] text-[#07080a] font-bold border-[#d8ff58] shadow-[0_0_20px_rgba(216,255,88,0.2)]"
                      : "border-white/10 bg-white/[0.03] text-[#989c99] hover:text-[#f0f0e9] hover:border-white/25"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? "bg-black/25 text-[#07080a]" : "bg-white/10 text-[#989c99]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Search Input */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 text-[#989c99] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by keyword or tag..."
              className="w-full pl-8 pr-3 py-1.5 rounded-full bg-white/[0.03] border border-white/10 hover:border-white/20 focus:border-[#d8ff58] focus:outline-none text-xs font-mono text-[#f0f0e9] placeholder-[#989c99]/50 transition-colors"
            />
          </div>
        </div>

        {/* Two-Column Layout (Post Feed + Sidebar) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Post Feed Column (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-5 sm:gap-6">
            {filteredPosts.length === 0 ? (
              <div className="p-8 rounded-2xl border border-white/10 bg-white/[0.02] text-center text-sm font-mono text-[#989c99]">
                No articles found matching "{searchQuery}" in {activeCategory}.
              </div>
            ) : (
              filteredPosts.map((post, idx) => (
                <article
                  key={post.slug}
                  onClick={() => handleCardClick(`/blog/posts/${post.slug}`)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      window.location.href = `/blog/posts/${post.slug}`;
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label={`Read article: ${post.frontmatter.title}`}
                  className="blog-card group relative rounded-2xl border border-white/10 bg-[#121316]/75 hover:bg-[#121316]/95 backdrop-blur-[24px] p-4 sm:p-6 transition-all duration-300 hover:border-[#d8ff58]/40 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] shadow-xl overflow-hidden cursor-pointer"
                >
                  {/* Ambient edge glow on hover */}
                  <div
                    className="pointer-events-none absolute -inset-[1px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(135deg, ${getCategoryColor(post.frontmatter.category)}30 0%, transparent 60%)`,
                      mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                      padding: "1px",
                    }}
                  />

                  <div className="flex flex-col-reverse sm:flex-row gap-4 sm:gap-6 justify-between items-start">
                    {/* Left Column: Post Meta, Title & Description */}
                    <div className="flex-1 min-w-0">
                      {/* Meta Top: Author, Date, Read Time, Category */}
                      <div className="flex flex-wrap items-center gap-2 mb-2.5 text-xs font-mono text-[#989c99]">
                        <div className="flex items-center gap-1.5 text-[#f0f0e9]">
                          <div className="relative w-4 h-4 rounded-full overflow-hidden border border-white/20">
                            <Image
                              src="/blog/avatar_dynamic_island.webp"
                              alt="Ayush Singh"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <span className="font-medium">Ayush Singh</span>
                        </div>
                        <span className="text-white/20">•</span>
                        <span>
                          {new Date(post.frontmatter.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}, {new Date(post.frontmatter.date).getFullYear()}
                        </span>
                        <span className="text-white/20">•</span>
                        <span className="inline-flex items-center gap-1 text-[#989c99]">
                          <Clock className="w-3 h-3" />
                          {post.frontmatter.readingTime}
                        </span>
                        <span className="text-white/20">•</span>
                        <span
                          className="text-[10px] px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.04]"
                          style={{ color: getCategoryColor(post.frontmatter.category) }}
                        >
                          {post.frontmatter.category}
                        </span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg sm:text-xl font-display font-semibold tracking-tight text-[#f0f0e9] group-hover:text-white transition-colors mb-2 leading-snug">
                        <Link href={`/blog/posts/${post.slug}`} className="group-hover:text-[#d8ff58] transition-colors underline-offset-4">
                          {post.frontmatter.title}
                        </Link>
                      </h2>

                      {/* Excerpt */}
                      <p className="text-xs sm:text-sm text-[#989c99] leading-relaxed line-clamp-3 font-light mb-4">
                        {post.frontmatter.description}
                      </p>

                      {/* Tags & Action Link */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/[0.07]">
                        <div className="flex flex-wrap gap-1.5">
                          {post.frontmatter.tags.map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] font-mono px-2 py-0.5 rounded-md border border-white/10 bg-white/[0.02] text-[#989c99]"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>

                        <Link
                          href={`/blog/posts/${post.slug}`}
                          className="inline-flex items-center gap-1.5 text-xs font-mono text-[#d8ff58] group-hover:translate-x-1 transition-transform"
                        >
                          <span>Read Article</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Placeholder Thumbnail */}
                    <div className="relative w-full sm:w-[140px] md:w-[160px] h-[100px] sm:h-[105px] rounded-xl overflow-hidden bg-black/60 border border-white/10 shrink-0 shadow-md">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center p-4">
                          <span className="text-[10px] font-mono text-[#989c99] uppercase tracking-wider">
                            {post.frontmatter.category}
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute bottom-1.5 right-1.5 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/80 backdrop-blur-md text-[#989c99] border border-white/10">
                        0{idx + 1}
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          {/* Sidebar Column (4 cols) */}
          <aside className="lg:col-span-4 flex flex-col gap-6 sticky top-28">
            {/* Author Profile Card */}
            <div className="blog-sidebar-card rounded-2xl border border-white/10 bg-[#121316]/75 backdrop-blur-[24px] p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-3.5 mb-4">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d8ff58] shadow-[0_0_15px_rgba(216,255,88,0.25)] shrink-0">
                  <Image
                    src="/blog/avatar_dynamic_island.webp"
                    alt="Ayush Singh"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#d8ff58] ring-2 ring-black" />
                </div>
                <div>
                  <h3 className="text-base font-display font-bold text-[#f0f0e9]">
                    Ayush Singh
                  </h3>
                  <p className="text-xs font-mono text-[#d8ff58]">@Singhcod3r</p>
                  <p className="text-[11px] font-mono text-[#989c99] mt-0.5">
                    OpenPrinting Maintainer · {initialPosts.length} stories
                  </p>
                </div>
              </div>

              <p className="text-xs text-[#989c99] leading-relaxed mb-4 pb-4 border-b border-white/[0.08]">
                Maintainer @TheLinuxFoundation || Open Source Contributor || Hacktoberfest '25
                Super Contributor || Full Stack Engineer
              </p>

              {/* GitHub Follow Button */}
              <a
                href="https://github.com/SinghCod3r"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full text-xs font-mono font-bold bg-[#d8ff58] text-[#07080a] hover:opacity-90 transition-opacity mb-3"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>Follow on GitHub</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              {/* RSS Link Pill */}
              <a
                href="/blog/rss.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-[11px] font-mono border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] text-[#989c99] hover:text-[#f0f0e9] transition-colors mb-4"
              >
                <Rss className="w-3 h-3 text-[#d8ff58]" />
                <span>Raw RSS Feed (/blog/rss.xml)</span>
              </a>

              {/* Social Link Badges */}
              <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/[0.08]">
                <a
                  href="https://github.com/SinghCod3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-[#989c99] hover:text-white transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-4 h-4" />
                </a>
                <a
                  href="https://www.linkedin.com/in/ayush-singh-46b5a3286/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-[#989c99] hover:text-white transition-colors"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </a>
                <a
                  href="mailto:singhayush9424@gmail.com"
                  className="p-2 rounded-lg border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-[#989c99] hover:text-white transition-colors text-xs font-mono"
                  aria-label="Email"
                >
                  @
                </a>
              </div>
            </div>

            {/* Categories */}
            <div className="blog-sidebar-card rounded-2xl border border-white/10 bg-[#121316]/50 backdrop-blur-[20px] p-5 shadow-lg">
              <h4 className="text-xs font-mono uppercase tracking-wider text-[#989c99] mb-3">
                Categories
              </h4>
              <div className="flex flex-col gap-2.5 text-xs font-display">
                {categories.slice(1).map((cat) => (
                  <div
                    key={cat.label}
                    className="flex items-center justify-between py-1 border-b border-white/[0.04] last:border-0"
                  >
                    <span className="text-[#f0f0e9] font-medium">{cat.label}</span>
                    <span className="text-[10px] font-mono text-[#989c99]">{cat.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
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
            className="text-[#d8ff58] hover:underline inline-flex items-center gap-1"
          >
            <span>← Return to Portfolio</span>
          </a>
        </div>
      </footer>
    </div>
  );
}