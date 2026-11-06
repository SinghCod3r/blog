"use client";

import React from "react";
import type { Post } from "../lib/types";
import { formatDate, calculateReadingTime } from "../lib/utils";
import TableOfContents from "./TableOfContents";
import CodeBlock from "./CodeBlock";
import Link from "next/link";
import { ArrowUpRight, FileText } from "lucide-react";
import { GithubIcon } from "./Icons";

interface ArticleLayoutProps {
  post: Post;
}

export default function ArticleLayout({ post }: ArticleLayoutProps) {
  const { frontmatter, htmlContent, headings, slug, content } = post;
  const readingTime = frontmatter.readingTime || calculateReadingTime(content);
  const accentHex = frontmatter.category.toLowerCase().includes("open source") || frontmatter.category.toLowerCase().includes("linux")
    ? "#d8ff58"
    : frontmatter.category.toLowerCase().includes("debug")
    ? "#a786ff"
    : frontmatter.category.toLowerCase().includes("python")
    ? "#ff806d"
    : "#7ff3da";

  return (
    <article className="prose-custom" itemScope itemType="https://schema.org/TechArticle">
      <header className="mb-12 md:mb-16">
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span
            className="px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-xs font-mono font-medium"
            style={{ color: accentHex, borderColor: `${accentHex}60` }}
          >
            {frontmatter.category}
          </span>
          <time
            itemProp="datePublished"
            className="text-xs font-mono text-muted"
            dateTime={frontmatter.date}
          >
            {formatDate(frontmatter.date)}
          </time>
          {frontmatter.updated && (
            <time
              itemProp="dateModified"
              className="text-xs font-mono text-muted"
              dateTime={frontmatter.updated}
            >
              Updated {formatDate(frontmatter.updated)}
            </time>
          )}
          <span className="text-xs font-mono text-muted">{readingTime}</span>
        </div>

        <h1 itemProp="headline" className="text-4xl sm:text-5xl md:text-6xl font-display font-semibold tracking-tight text-[#f0f0e9] mb-6">
          {frontmatter.title}
        </h1>

        <p itemProp="description" className="text-lg text-paper/70 max-w-3xl mb-8 font-light leading-relaxed">
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

        <TableOfContents headings={headings} />
      </div>

      <footer className="mt-16 pt-8 border-t border-line">
        {/* Author Section */}
        <div className="mb-10 p-6 glass-panel rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#d8ff58] shadow-[0_0_15px_rgba(216,255,88,0.25)] shrink-0">
              <img
                src="/blog/avatar_dynamic_island.webp"
                alt="Ayush Singh"
                className="w-full h-full object-cover"
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
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-95"
                aria-label="GitHub"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href="https://singhcod3r.github.io/"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 flex items-center justify-center text-white/80 hover:text-[#a786ff] transition-all active:scale-95"
                aria-label="Portfolio"
              >
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Article Navigation */}
        <nav className="flex items-center justify-between" aria-label="Article navigation">
          <Link
            href="/"
            className="btn-portfolio-secondary group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Articles
          </Link>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/OpenPrinting/system-config-printer"
              rel="noopener noreferrer"
              className="btn-portfolio-ghost group"
            >
              <GithubIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              <span>View on GitHub</span>
            </a>
          </div>
        </nav>
      </footer>
    </article>
  );
}