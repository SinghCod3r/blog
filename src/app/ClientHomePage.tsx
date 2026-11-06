"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, ArrowDown, FileText } from "lucide-react";
import DynamicIslandNav from "../components/DynamicIslandNav";
import MobileMenuDrawer from "../components/MobileMenuDrawer";
import { TerminalPromptIcon } from "../components/Icons";
import ArticleCard from "../components/ArticleCard";
import type { Post } from "../lib/types";

gsap.registerPlugin(ScrollTrigger);

interface ClientHomePageProps {
  posts: Post[];
  featuredPost: Post | null;
  otherPosts: Post[];
}

export default function ClientHomePage({ posts, featuredPost, otherPosts }: ClientHomePageProps) {
  const [introDone, setIntroDone] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setIntroDone(true);
      return;
    }

    // High refresh-rate mobile scroll optimization:
    // On mobile touch devices, NEVER hijack touch events with artificial JS lerp scrolling!
    // Native mobile OS compositor scrolling runs at full 120Hz (ProMotion) / 90Hz hardware refresh rate with zero lag.
    // Lenis smooth wheel is only enabled on desktop for mouse wheel / trackpad users.
    const isMobileOrTouch =
      typeof window !== "undefined" &&
      (window.innerWidth < 768 ||
        window.matchMedia("(pointer: coarse)").matches ||
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0);

    if (!isMobileOrTouch) {
      // Lenis is initialized via SmoothScrollProvider context
      // This is just for GSAP ScrollTrigger sync
      gsap.ticker.lagSmoothing(500, 33);
    }

    // GSAP Kinetic Reveal for Hero Tagline Words
    const words = gsap.utils.toArray<HTMLElement>(".hero-tagline-word");
    if (words.length > 0) {
      gsap.fromTo(
        words,
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.05,
          duration: 0.9,
          delay: 0.65,
          ease: "power3.out",
        }
      );
    }

    // GSAP Subtle Fade for Supporting Action Buttons
    gsap.fromTo(
      ".hero-fade",
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        delay: 0.95,
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

  return (
    <>
      {/* 1. Fluid Liquid Silk Aurora Canvas */}
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 75% 55% at 50% 35%, rgba(216,255,88,0.025) 0%, rgba(167,134,255,0.015) 40%, transparent 75%)"
      }} />

      {/* 2. Skiper UI Persistent Dynamic Island Navigation */}
      <DynamicIslandNav visible={introDone} />

      {/* 3. Mobile Menu Drawer */}
      <MobileMenuDrawer />

      {/* 4. THE REDESIGNED EXPERIMENTAL HERO / LANDING SECTION */}
      <section
        id="hero"
        className="relative w-full min-h-[100svh] bg-[#07080a] overflow-hidden flex flex-col justify-between items-center px-4 sm:px-8 pt-16 sm:pt-20 pb-5 sm:pb-7 select-none"
      >
        {/* Deep Seamless Theme Atmosphere (#07080a) */}
        <div className="pointer-events-none absolute inset-0 z-0 bg-[#07080a]" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_35%,rgba(216,255,88,0.025)_0%,rgba(167,134,255,0.015)_40%,transparent_75%)]" />

        {/* Full-bleed Edge-to-Edge Top & Bottom Theme Transitions */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-28 sm:h-36 bg-gradient-to-b from-[#07080a] via-[#07080a]/75 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 sm:h-48 bg-gradient-to-t from-[#07080a] via-[#07080a]/80 to-transparent z-10" />

        {/* Top spacer (ensures ample breathing room below the floating Dynamic Island) */}
        <div className="relative z-10 w-full h-8 sm:h-12" />

        {/* HERO TYPOGRAPHY & LOWER POSITIONING */}
        <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center justify-end mt-auto mb-2 sm:mb-5 pt-8 sm:pt-14 text-center">
          {/* ANIMATED EDITORIAL TITLE */}
          <div className="w-full flex flex-col items-center justify-center select-none px-4">
            <div className="flex flex-col items-center justify-center">
              <h1 className="flex flex-nowrap items-baseline justify-center font-display font-black tracking-[-0.04em] uppercase italic leading-[0.84] text-[12vw] sm:text-[10vw] lg:text-[7rem] xl:text-[9rem] text-[#F2F2EE]">
                <span className="inline-block">TECHNICAL</span>
                <br />
                <span className="inline-block text-lime">WRITINGS</span>
              </h1>
            </div>
          </div>

          {/* REFINED EDITORIAL SUBTITLE & COPY */}
          <div className="hero-editorial-fade mt-5 sm:mt-7 flex flex-col items-center max-w-2xl mx-auto px-4">
            <p className="text-[11px] sm:text-xs font-mono text-[#F2F2EE]/85 tracking-[0.25em] uppercase mb-1.5 font-medium">
              Notes from building, debugging and contributing to real software.
            </p>
            <p className="text-xs sm:text-sm text-[#8c908d] leading-relaxed font-light text-balance">
              A personal engineering publication covering Linux systems, open source contribution, developer tooling, and the craft of debugging complex software.
            </p>

            {/* SINGLE SUBTLE CTA */}
            <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 hero-fade">
              <Link href="/blog/rss.xml" className="btn-portfolio-secondary">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M6 18c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                </svg>
                Subscribe via RSS
              </Link>
              <a
                href="https://github.com/SinghCod3r"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-portfolio-secondary"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM MINIMAL SCROLL PROMPT */}
        <div className="hero-editorial-fade relative z-10 w-full flex flex-col items-center pb-2 text-[#707471]">
          <a
            href="#featured"
            className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-mono uppercase tracking-[0.22em] text-[#707471] hover:text-[#F2F2EE] transition-colors py-1 group"
          >
            <span>SCROLL</span>
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">↓</span>
          </a>
        </div>
      </section>

      {/* Velocity-aware Scrolling Ribbon */}
      <div className="relative overflow-hidden py-4 bg-black/20" style={{ maskImage: "linear-gradient(to right, transparent, black 20%, black 80%, transparent)" }}>
        <div className="flex animate-spin-slow whitespace-nowrap will-change-transform" style={{ animationDuration: "30s" }}>
          {[
            "Open Source Developer",
            "Python Tooling",
            "Linux Systems",
            "Clean Architecture",
            "Web Applications",
            "The Linux Foundation",
            "CUPS Printing",
            "GTK & GNOME",
            "Debugging & Tracing",
            "Systems Programming",
          ].map((item, i) => (
            <span key={i} className="px-6 py-1 font-mono text-xs text-white/30 hover:text-lime transition-colors cursor-default">
              {item}
              <span className="mx-4 text-white/10">•</span>
            </span>
          ))}
        </div>
      </div>

      {/* 5. FEATURED ARTICLE SECTION */}
      {featuredPost && (
        <section
          id="featured"
          className="relative w-full py-12 sm:py-24 md:py-36 px-4 sm:px-12 lg:px-16 2xl:px-20 max-w-[1720px] mx-auto overflow-hidden"
        >
          <div className="reveal-element mb-8 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#d8ff58] mb-2 block">
                Featured
              </span>
              <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-[#f0f0e9]">
                Featured Article.
              </h2>
            </div>
          </div>

          <ArticleCard post={featuredPost} featured index={0} />
        </section>
      )}

      {/* Section Divider */}
      <div className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <div
          className="absolute h-[1px] w-full max-w-7xl"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, #a786ff40 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-[#0c0d0e]/80 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#989c99]">
          <span className="opacity-70">FEATURED</span>
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute w-2 h-2 rounded-full animate-ping opacity-75" style={{ backgroundColor: "#a786ff" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#a786ff" }} />
          </div>
          <span className="text-[#f0f0e9] font-medium">ARTICLES</span>
        </div>
      </div>

      {/* 6. ALL ARTICLES SECTION */}
      <section
        id="articles"
        className="relative w-full py-12 sm:py-24 md:py-36 px-4 sm:px-12 lg:px-16 2xl:px-20 max-w-[1720px] mx-auto overflow-hidden"
      >
        <div className="reveal-element mb-8 sm:mb-16 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#a786ff] mb-2 block">
              Portfolio
            </span>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-[#f0f0e9]">
              Latest Articles.
            </h2>
          </div>
        </div>

        {otherPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {otherPosts.map((post, index) => (
              <ArticleCard key={post.slug} post={post} index={index + 1} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-body text-paper/60">No articles yet. Check back soon!</p>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-body text-paper/60 mb-6">No articles published yet.</p>
            <p className="text-body-sm text-muted font-mono">Add a Markdown file to <code>content/posts/</code> to get started.</p>
          </div>
        )}
      </section>

      {/* Section Divider */}
      <div className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <div
          className="absolute h-[1px] w-full max-w-7xl"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, #ff806d40 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-[#0c0d0e]/80 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#989c99]">
          <span className="opacity-70">ARTICLES</span>
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute w-2 h-2 rounded-full animate-ping opacity-75" style={{ backgroundColor: "#ff806d" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#ff806d" }} />
          </div>
          <span className="text-[#f0f0e9] font-medium">ABOUT</span>
        </div>
      </div>

      {/* 7. ABOUT THE AUTHOR SECTION */}
      <section
        id="about"
        className="relative w-full py-12 sm:py-24 md:py-36 px-4 sm:px-12 lg:px-16 2xl:px-20 max-w-[1720px] mx-auto overflow-hidden"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left Column: Pure Circular Portrait */}
          <div className="lg:col-span-5 reveal-element">
            <div className="relative aspect-square max-w-[380px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#d8ff58]/20 via-transparent to-[#a786ff]/20 blur-3xl opacity-50" />
              <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_60px_rgba(216,255,88,0.15),0_0_120px_rgba(167,134,255,0.1)]">
                <Image
                  src="/blog/avatar_large.webp"
                  alt="Ayush Singh"
                  fill
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              {/* Orbiting accent dots */}
              <div className="pointer-events-none absolute -inset-4 animate-spin-slow" style={{ animationDuration: "60s" }}>
                <div className="absolute top-0 left-1/2 w-2 h-2 rounded-full bg-lime/60 blur-sm" />
                <div className="absolute top-1/2 right-0 w-1.5 h-1.5 rounded-full bg-violet/60 blur-sm" />
                <div className="absolute bottom-0 left-1/2 w-2 h-2 rounded-full bg-cyan/60 blur-sm" />
                <div className="absolute top-1/2 left-0 w-1.5 h-1.5 rounded-full bg-coral/60 blur-sm" />
              </div>
            </div>
          </div>

          {/* Right Column: Minimal, Human Copy */}
          <div className="lg:col-span-7 flex flex-col justify-between reveal-element">
            <span className="text-xs font-mono uppercase tracking-widest text-[#ff806d] mb-3 sm:mb-4">
              About Me
            </span>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-display font-medium tracking-tight leading-tight text-[#f0f0e9] mb-4 sm:mb-6">
              I build reliable software and contribute to open source.
            </h2>

            <div className="space-y-3 sm:space-y-4 text-sm sm:text-base text-[#989c99] leading-relaxed mb-6 sm:mb-8 max-w-2xl font-light">
              <p>
                I&apos;m Ayush, a software developer from Lucknow, India. As an open-source maintainer with The Linux Foundation (OpenPrinting), I investigated desktop UI freezing issues, unblocked event loops with background worker threads, and improved device detection for Ubuntu and Debian users.
              </p>
              <p>
                I also build custom interpreters in Python, design REST APIs, and develop responsive web applications.
              </p>
            </div>

            {/* Clean Proof Points */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 mb-6 sm:mb-8">
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-lg sm:text-xl font-display font-bold text-[#d8ff58]">Maintainer</div>
                <div className="text-[11px] sm:text-xs font-mono text-[#989c99]">The Linux Foundation</div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-lg sm:text-xl font-display font-bold text-[#a786ff]">OpenPrinting</div>
                <div className="text-[11px] sm:text-xs font-mono text-[#989c99]">system-config-printer</div>
              </div>
              <div className="p-3.5 sm:p-4 rounded-xl sm:rounded-2xl border border-white/10 bg-white/[0.02]">
                <div className="text-lg sm:text-xl font-display font-bold text-[#7ff3da]">GSoC 2024</div>
                <div className="text-[11px] sm:text-xs font-mono text-[#989c99]">The Linux Foundation</div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-4">
              <a
                href="https://github.com/SinghCod3r"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/10 hover:bg-[#d8ff58] hover:text-[#0c0d0e] text-[#f0f0e9] font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200"
              >
                <span>GitHub Profile</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://singhcod3r.github.io/Ayush_Singh.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-white/20 hover:border-white/50 text-[#f0f0e9] font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all duration-200"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Resume (PDF)</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div className="relative w-full py-12 flex items-center justify-center overflow-hidden pointer-events-none select-none">
        <div
          className="absolute h-[1px] w-full max-w-7xl"
          style={{
            background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 20%, #d8ff5840 50%, rgba(255,255,255,0.08) 80%, transparent 100%)",
          }}
        />
        <div className="relative z-10 flex items-center gap-4 px-6 py-2 rounded-full border border-white/10 bg-[#0c0d0e]/80 backdrop-blur-md text-[11px] font-mono tracking-widest text-[#989c99]">
          <span className="opacity-70">ABOUT</span>
          <div className="relative flex items-center justify-center w-3 h-3">
            <span className="absolute w-2 h-2 rounded-full animate-ping opacity-75" style={{ backgroundColor: "#d8ff58" }} />
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#d8ff58" }} />
          </div>
          <span className="text-[#f0f0e9] font-medium">PORTFOLIO</span>
        </div>
      </div>

      {/* 8. PORTFOLIO CTA SECTION */}
      <section className="relative w-full py-12 sm:py-24 md:py-36 px-4 sm:px-12 lg:px-16 2xl:px-20 max-w-[1720px] mx-auto overflow-hidden">
        <div className="reveal-element text-center">
          <span className="text-xs font-mono uppercase tracking-widest text-[#d8ff58] mb-2 block">
            Explore More
          </span>
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-display font-medium tracking-tight text-[#f0f0e9] mb-6">
            View Full Portfolio.
          </h2>
          <p className="text-sm sm:text-base text-[#989c99] leading-relaxed font-light max-w-2xl mx-auto mb-8">
            Selected projects, architecture deep dives, speaking engagements, and my complete tech stack.
          </p>
          <a
            href="https://singhcod3r.github.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/10 hover:bg-[#d8ff58] hover:text-[#0c0d0e] text-[#f0f0e9] font-mono text-xs uppercase tracking-wider transition-all duration-200"
          >
            <span>Open Portfolio</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </section>
    </>
  );
}