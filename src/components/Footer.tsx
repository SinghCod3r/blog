"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowUp } from "lucide-react";

export default function Footer() {
  const letters = ["S", "i", "n", "g", "h", "C", "o", "d", "3", "r"];
  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [proximityFactors, setProximityFactors] = useState<number[]>(letters.map(() => 0));

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Check if mouse is near footer
      if (
        e.clientY < rect.top - 150 ||
        e.clientY > rect.bottom + 150 ||
        e.clientX < rect.left - 50 ||
        e.clientX > rect.right + 50
      ) {
        setProximityFactors(letters.map(() => 0));
        return;
      }

      const factors = letters.map((_, i) => {
        const el = letterRefs.current[i];
        if (!el) return 0;
        const letterRect = el.getBoundingClientRect();
        const letterCenterX = letterRect.left + letterRect.width / 2;
        const letterCenterY = letterRect.top + letterRect.height / 2;

        const distance = Math.hypot(e.clientX - letterCenterX, e.clientY - letterCenterY);
        const maxDist = 200; // Influence radius in pixels
        if (distance > maxDist) return 0;

        // Smooth cosine falloff
        return Math.cos((distance / maxDist) * (Math.PI / 2));
      });

      setProximityFactors(factors);
    };

    const handleMouseLeave = () => {
      setProximityFactors(letters.map(() => 0));
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [letters]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full pt-10 pb-8 sm:pt-16 sm:pb-12 overflow-hidden bg-[#07080a] select-none">
      {/* Top subtle bar */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-12 lg:px-16 flex items-center justify-end pb-4 sm:pb-8 border-b border-white/10 text-xs font-mono text-[#989c99]">
        <button
          onClick={scrollToTop}
          className="flex items-center gap-2 text-[#f0f0e9] hover:text-[#d8ff58] transition-colors"
        >
          <span>Back to Top</span>
          <ArrowUp className="w-4 h-4" />
        </button>
      </div>

      {/* Responsive Wordmark Container - Guaranteed to fit inside screen */}
      <div
        ref={containerRef}
        className="w-full max-w-[1720px] mx-auto px-2 sm:px-8 py-6 sm:py-16 flex justify-center items-center overflow-hidden"
      >
        <div className="flex items-center justify-center tracking-tighter cursor-default font-display font-bold leading-none max-w-full">
          {letters.map((char, index) => {
            const factor = proximityFactors[index] || 0;
            const translateY = -factor * 24; // Lift up smoothly
            const scale = 1 + factor * 0.12; // Controlled lift scale
            const isDigit = char === "3";

            return (
              <span
                key={index}
                ref={(el) => {
                  letterRefs.current[index] = el;
                }}
                style={{
                  transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
                  color: isDigit
                    ? factor > 0.3
                      ? "#d8ff58"
                      : "#c4f938"
                    : factor > 0.4
                    ? "#ffffff"
                    : factor > 0.1
                    ? "#e8eae5"
                    : "#64676b",
                  textShadow:
                    factor > 0.2
                      ? `0 0 30px ${isDigit ? "rgba(216,255,88,0.7)" : "rgba(255,255,255,0.4)"}`
                      : "none",
                  transition: "transform 0.12s ease-out, color 0.18s ease-out, text-shadow 0.18s ease-out",
                }}
                className="inline-block text-[clamp(1.75rem,7.4vw,9.5rem)] select-none will-change-transform"
              >
                {char}
              </span>
            );
          })}
        </div>
      </div>

      {/* Bottom Legal & Colophon Bar */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-12 lg:px-16 pt-5 sm:pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-[11px] sm:text-xs font-mono text-[#989c99] text-center sm:text-left">
        <div>© {currentYear} Ayush Singh (SinghCod3r). Open Source by Default.</div>
        <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-6">
          <span className="text-[#f0f0e9]">Lucknow, India</span>
          <span className="text-white/20">•</span>
          <a href="https://github.com/SinghCod3r" target="_blank" rel="noopener noreferrer" className="hover:text-[#d8ff58] transition-colors">GitHub</a>
          <span className="text-white/20">•</span>
          <a href="https://singhcod3r.github.io/" target="_blank" rel="noopener noreferrer" className="hover:text-[#d8ff58] transition-colors">Portfolio</a>
          <span className="text-white/20">•</span>
          <a href="/blog/rss.xml" className="hover:text-[#d8ff58] transition-colors text-[#d8ff58]">RSS</a>
        </div>
      </div>
    </footer>
  );
}