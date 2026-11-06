"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { Post } from "../lib/types";
import { formatDate } from "../lib/utils";

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
  index?: number;
}

const accentColorMap: Record<string, string> = {
  lime: "#d8ff58",
  violet: "#a786ff",
  coral: "#ff806d",
  cyan: "#7ff3da",
};

function getAccentColor(category: string): string {
  const categoryLower = category.toLowerCase();
  if (categoryLower.includes("open source") || categoryLower.includes("linux")) return "#d8ff58";
  if (categoryLower.includes("debug") || categoryLower.includes("system")) return "#a786ff";
  if (categoryLower.includes("python") || categoryLower.includes("tool")) return "#ff806d";
  if (categoryLower.includes("web") || categoryLower.includes("ai")) return "#7ff3da";
  return "#d8ff58";
}

export default function ArticleCard({ post, featured = false, index = 0 }: ArticleCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const { frontmatter, slug } = post;
  const accentHex = getAccentColor(frontmatter.category);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    setCoords({ x: mouseX, y: mouseY });

    const rotX = ((mouseY / rect.height) - 0.5) * -12;
    const rotY = ((mouseX / rect.width) - 0.5) * 12;

    setTilt({ rx: rotX, ry: rotY });
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
  };

  if (featured) {
    return (
      <article
        ref={cardRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        style={{
          transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
          transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
        className="group relative rounded-2xl sm:rounded-3xl border border-white/15 bg-[#121316]/60 backdrop-blur-[30px] saturate-[190%] shadow-[0_15px_40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col [transform-style:preserve-3d] min-h-[520px] active:scale-[0.99] transition-transform"
        id="featured"
      >
        {/* Dynamic Specular Border & Light Reflection */}
        <div
          className="pointer-events-none absolute inset-0 z-20 rounded-2xl sm:rounded-3xl transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.18), transparent 70%)`,
          }}
        />

        {/* 1px Specular Border Highlight Overlay */}
        <div
          className="pointer-events-none absolute -inset-[1px] rounded-2xl sm:rounded-3xl z-10 transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0,
            background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${accentHex}90, transparent 65%)`,
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
            padding: "1px",
          }}
        />

        {/* Top Accent Bar */}
        <div className="relative w-full h-1" style={{ background: `linear-gradient(90deg, ${accentHex}40, ${accentHex} 50%, ${accentHex}40)` }} />

        {/* Content Area with Elevated translateZ */}
        <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between [transform:translateZ(45px)] relative z-10">
          <div>
            {/* Category & Metadata Badges */}
            <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
              <span
                className="px-3 py-1 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[11px] sm:text-xs font-mono font-medium"
                style={{ color: accentHex, borderColor: `${accentHex}60` }}
              >
                {frontmatter.category}
              </span>
              <time className="text-[11px] sm:text-xs font-mono text-[#989c99]" dateTime={frontmatter.date}>
                {formatDate(frontmatter.date)}
              </time>
              {frontmatter.readingTime && (
                <span className="text-[11px] sm:text-xs font-mono text-[#989c99]">
                  {frontmatter.readingTime}
                </span>
              )}
            </div>

            <Link
              href={`/posts/${slug}/`}
              className="block group"
              aria-label={`Read ${frontmatter.title}`}
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-semibold tracking-tight text-[#f0f0e9] group-hover:text-white transition-colors mb-3 sm:mb-4 line-clamp-2">
                {frontmatter.title}
              </h2>
              <p className="text-sm sm:text-base text-[#989c99] leading-relaxed font-light mb-4 sm:mb-6 line-clamp-3">
                {frontmatter.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-6">
                {frontmatter.tags.slice(0, 6).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 bg-white/[0.03] text-[#f0f0e9]/80"
                  >
                    {tag}
                  </span>
                ))}
                {frontmatter.tags.length > 6 && (
                  <span className="text-[10px] sm:text-[11px] font-mono px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full border border-white/10 bg-white/[0.03] text-[#989c99]">
                    +{frontmatter.tags.length - 6} more
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Bottom Action */}
          <div className="pt-4 sm:pt-6 border-t border-white/10 [transform:translateZ(35px)]">
            <Link
              href={`/posts/${slug}/`}
              className="group inline-flex items-center gap-2 text-xs font-mono font-medium transition-all duration-200 text-[#d8ff58] hover:underline"
            >
              <span>Read Article</span>
              <ExternalLink className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      ref={cardRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      style={{
        transform: `perspective(1200px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        transition: isHovered ? "transform 0.1s ease-out" : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
      }}
      className="group relative rounded-2xl sm:rounded-3xl border border-white/15 bg-[#121316]/60 backdrop-blur-[30px] saturate-[190%] shadow-[0_15px_40px_rgba(0,0,0,0.35)] overflow-hidden flex flex-col [transform-style:preserve-3d] min-h-[420px] active:scale-[0.99] transition-transform h-full"
    >
      {/* Dynamic Specular Border & Light Reflection */}
      <div
        className="pointer-events-none absolute inset-0 z-20 rounded-2xl sm:rounded-3xl transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(450px circle at ${coords.x}px ${coords.y}px, rgba(255,255,255,0.18), transparent 70%)`,
        }}
      />

      {/* 1px Specular Border Highlight Overlay */}
      <div
        className="pointer-events-none absolute -inset-[1px] rounded-2xl sm:rounded-3xl z-10 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(350px circle at ${coords.x}px ${coords.y}px, ${accentHex}90, transparent 65%)`,
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          padding: "1px",
        }}
      />

      {/* Top Accent Bar */}
      <div className="relative w-full h-1" style={{ background: `linear-gradient(90deg, ${accentHex}40, ${accentHex} 50%, ${accentHex}40)` }} />

      {/* Content Area with Elevated translateZ */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between [transform:translateZ(45px)] relative z-10">
        <div>
          {/* Category & Metadata Badges */}
          <div className="flex items-center gap-2 mb-3 sm:mb-4 flex-wrap">
            <span
              className="px-2.5 py-0.5 rounded-full border border-white/20 bg-black/60 backdrop-blur-md text-[10px] sm:text-xs font-mono font-medium"
              style={{ color: accentHex, borderColor: `${accentHex}60` }}
            >
              {frontmatter.category}
            </span>
            <time className="text-[10px] sm:text-xs font-mono text-[#989c99]" dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            {frontmatter.readingTime && (
              <span className="text-[10px] sm:text-xs font-mono text-[#989c99]">
                {frontmatter.readingTime}
              </span>
            )}
          </div>

          <Link
            href={`/posts/${slug}/`}
            className="block flex-1 group"
            aria-label={`Read ${frontmatter.title}`}
          >
            <h3 className="text-xl sm:text-2xl font-display font-semibold tracking-tight text-[#f0f0e9] group-hover:text-white transition-colors mb-2 sm:mb-3 line-clamp-2">
              {frontmatter.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#989c99] leading-relaxed font-light flex-1 mb-4 line-clamp-2">
              {frontmatter.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {frontmatter.tags.slice(0, 4).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[#f0f0e9]/80"
                >
                  {tag}
                </span>
              ))}
              {frontmatter.tags.length > 4 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full border border-white/10 bg-white/[0.03] text-[#989c99]">
                  +{frontmatter.tags.length - 4} more
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Bottom Action */}
        <div className="pt-3 sm:pt-4 border-t border-white/10 [transform:translateZ(35px)]">
          <Link
            href={`/posts/${slug}/`}
            className="group inline-flex items-center gap-1.5 text-xs font-mono font-medium transition-all duration-200 text-[#d8ff58] hover:underline"
          >
            <span>Read Article</span>
            <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </article>
  );
}