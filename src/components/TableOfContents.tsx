"use client";

import { useEffect, useState } from "react";
import type { Heading } from "../lib/types";

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(true);

  if (headings.length < 2) {
    return null;
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px", threshold: 0 }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  const h2Headings = headings.filter((h) => h.level === 2);
  const h3Headings = headings.filter((h) => h.level === 3);

  return (
    <aside className="hidden lg:block" aria-label="Table of contents">
      <div className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto pr-4">
        <button
          className="w-full flex items-center justify-between text-xs font-mono text-muted mb-4 p-2 rounded-lg hover:bg-paper/5 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-controls="toc-list"
        >
          <span className="uppercase tracking-widest">On this page</span>
          <svg
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <nav id="toc-list" className={`${isOpen ? "block" : "hidden"} space-y-1`} aria-label="Table of contents">
          {h2Headings.map((h2) => (
            <div key={h2.id} className="pl-3 border-l border-line/50">
              <a
                href={`#${h2.id}`}
                className={`block py-1.5 text-sm transition-colors duration-200 ${
                  activeId === h2.id ? "text-lime" : "text-muted hover:text-paper"
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.getElementById(h2.id);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    history.pushState(null, "", `#${h2.id}`);
                    setActiveId(h2.id);
                  }
                }}
              >
                {h2.text}
              </a>
              {h3Headings.filter((h3) => headings.indexOf(h3) > headings.indexOf(h2)).slice(0, 3).map((h3) => (
                <a
                  key={h3.id}
                  href={`#${h3.id}`}
                  className={`block pl-3 py-1 text-xs font-mono transition-colors duration-200 ${
                    activeId === h3.id ? "text-lime/80" : "text-muted/70 hover:text-paper/70"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.getElementById(h3.id);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                      history.pushState(null, "", `#${h3.id}`);
                      setActiveId(h3.id);
                    }
                  }}
                >
                  {h3.text}
                </a>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
}