"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowUpRight, FileText, ChevronDown, BookOpen, Code } from "lucide-react";

interface NavSection {
  id: string;
  label: string;
  num: string;
  href: string;
}

const NAV_SECTIONS: NavSection[] = [
  { id: "hero", label: "HOME", num: "01", href: "/" },
  { id: "featured", label: "FEATURED", num: "02", href: "#featured" },
  { id: "articles", label: "ARTICLES", num: "03", href: "#articles" },
  { id: "about", label: "ABOUT", num: "04", href: "#about" },
];

/* ========================================================================= */
/* VERTICAL ROLLING TEXT COMPONENT                                           */
/* ========================================================================= */
function RollingSectionText({ activeLabel }: { activeLabel: string }) {
  const [currentText, setCurrentText] = useState(activeLabel);
  const [prevText, setPrevText] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  useEffect(() => {
    if (activeLabel !== currentText) {
      setPrevText(currentText);
      setCurrentText(activeLabel);
      setIsRolling(true);

      const timer = setTimeout(() => {
        setIsRolling(false);
        setPrevText(null);
      }, 380);

      return () => clearTimeout(timer);
    }
  }, [activeLabel, currentText]);

  return (
    <div className="relative h-4.5 overflow-hidden flex items-center justify-center min-w-[76px] sm:min-w-[90px] select-none">
      {/* Old word rolling upward and fading out */}
      {isRolling && prevText && (
        <span
          className="absolute inset-0 flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold tracking-wider text-[#989c99] uppercase transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] transform -translate-y-full opacity-0"
        >
          {prevText}
        </span>
      )}

      {/* New word rolling upward from below into position */}
      <span
        style={{
          transform: isRolling ? "translateY(0)" : "translateY(0)",
          opacity: 1,
        }}
        className={`inline-flex items-center justify-center font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase transition-all duration-380 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isRolling ? "animate-roll-in" : ""
        }`}
      >
        {currentText}
      </span>
    </div>
  );
}

/* ========================================================================= */
/* SKIPER UI DYNAMIC ISLAND NAVIGATION COMPONENT                             */
/* ========================================================================= */
export default function DynamicIslandNav({ visible = true }: { visible?: boolean }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState("hero");
  const islandRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.location.search.includes("menu=open")) {
      setIsExpanded(true);
    }
  }, []);

  // Active section label lookup
  const currentSection = NAV_SECTIONS.find((s) => s.id === activeSectionId) || NAV_SECTIONS[0];

  // 1. Scrollspy using IntersectionObserver
  useEffect(() => {
    const sectionElements = NAV_SECTIONS.map((s) => document.getElementById(s.id)).filter(
      Boolean
    ) as HTMLElement[];

    if (!sectionElements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -55% 0px",
        threshold: 0.1,
      }
    );

    sectionElements.forEach((el) => observer.observe(el));

    return () => {
      sectionElements.forEach((el) => observer.unobserve(el));
      observer.disconnect();
    };
  }, []);

  // 2. Click outside & Escape key listeners
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (islandRef.current && !islandRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    };

    if (isExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  // 3. Smooth navigate to section
  const handleNavigate = (section: NavSection) => {
    setIsExpanded(false);
    setActiveSectionId(section.id);

    const target = document.getElementById(section.id);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth" });
      }, 150);
    } else if (section.href.startsWith("/")) {
      // For external navigation (like portfolio link), just navigate
      window.location.href = section.href;
    }
  };

  return (
    <>
      {/* Dimmed backdrop when expanded */}
      <div
        onClick={() => setIsExpanded(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-md transition-opacity duration-300 ${
          isExpanded ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Floating Dynamic Island Chassis */}
      <div
        ref={islandRef}
        className={`fixed top-3 sm:top-5 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] select-none will-change-transform ${
          visible
            ? "opacity-100 translate-y-0 pointer-events-auto scale-100"
            : "opacity-0 -translate-y-10 pointer-events-none scale-95"
        }`}
      >
        {!isExpanded ? (
          /* =============================================================== */
          /* COMPACT DYNAMIC ISLAND STATE                                    */
          /* =============================================================== */
          <div
            onClick={() => setIsExpanded(true)}
            className="group relative flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#08090c]/92 hover:bg-[#0c0d12] backdrop-blur-2xl border border-white/15 hover:border-[#d8ff58]/40 shadow-[0_12px_36px_rgba(0,0,0,0.85)] cursor-pointer transition-all duration-300 active:scale-95"
            role="button"
            aria-label="Open Dynamic Island navigation"
          >
            {/* Specular Top Sheen */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />

            {/* Circular Profile Avatar (Interactive trigger) */}
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

            {/* Vertical Rolling Section Name */}
            <RollingSectionText activeLabel={currentSection.label} />

            {/* Active Beacon / Expand Indicator */}
            <div className="flex items-center gap-1 pl-0.5 text-[#989c99] group-hover:text-[#d8ff58] transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#d8ff58] shadow-[0_0_6px_#d8ff58] animate-pulse" />
              <ChevronDown className="w-3 h-3 transition-transform duration-200 group-hover:translate-y-0.5" />
            </div>
          </div>
        ) : (
          /* =============================================================== */
          /* EXPANDED DYNAMIC ISLAND STATE                                   */
          /* =============================================================== */
          <div className="w-[92vw] max-w-[340px] sm:max-w-[380px] rounded-3xl bg-[#090a0e]/95 backdrop-blur-3xl border border-white/15 shadow-[0_24px_64px_rgba(0,0,0,0.9)] p-4 sm:p-5 flex flex-col gap-3.5 animate-island-expand">
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
                onClick={() => setIsExpanded(false)}
                className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/15 border border-white/15 flex items-center justify-center text-white/80 hover:text-white transition-all active:scale-90"
                aria-label="Close navigation"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Navigation Options List */}
            <nav className="flex flex-col gap-1 py-1">
              {NAV_SECTIONS.map((sec) => {
                const isActive = sec.id === activeSectionId;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleNavigate(sec)}
                    className={`group/item flex items-center justify-between px-3 py-2 rounded-xl text-left transition-all duration-200 active:scale-[0.98] ${
                      isActive
                        ? "bg-[#d8ff58]/10 border border-[#d8ff58]/35 text-white"
                        : "hover:bg-white/[0.04] text-[#989c99] hover:text-[#f0f0e9]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[10px] text-white/35 group-hover/item:text-[#d8ff58] transition-colors">
                        {sec.num}
                      </span>
                      <span
                        className={`font-mono text-xs font-bold tracking-wider uppercase transition-colors ${
                          isActive ? "text-[#d8ff58]" : "group-hover/item:text-white"
                        }`}
                      >
                        {sec.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#d8ff58] shadow-[0_0_6px_#d8ff58] animate-pulse" />
                      )}
                      <span className="text-xs text-white/30 group-hover/item:text-white/80 transition-transform duration-200 group-hover/item:translate-x-0.5">
                        →
                      </span>
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Actions: Portfolio, GitHub & Resume Download */}
            <div className="pt-2 border-t border-white/10 flex items-center gap-1.5">
              <a
                href="https://singhcod3r.github.io/"
                rel="noopener noreferrer"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <ArrowUpRight className="w-3 h-3 text-[#a786ff]" />
                <span>Portfolio</span>
              </a>

              <a
                href="https://github.com/SinghCod3r"
                rel="noopener noreferrer"
                onClick={() => setIsExpanded(false)}
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.1] border border-white/10 text-white font-mono text-[11px] font-medium flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <Code className="w-3 h-3 text-[#d8ff58]" />
                <span>GitHub</span>
              </a>

              <a
                href="https://singhcod3r.github.io/Ayush_Singh.pdf"
                rel="noopener noreferrer"
                className="flex-1 py-1.5 px-2 rounded-xl bg-white/[0.06] hover:bg-[#d8ff58] text-white hover:text-black font-mono text-[11px] font-semibold flex items-center justify-center gap-1 transition-all duration-200 active:scale-95 group"
              >
                <FileText className="w-3 h-3 group-hover:text-black text-[#d8ff58]" />
                <span>Resume</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </>
  );
}