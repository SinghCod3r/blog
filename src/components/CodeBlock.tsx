"use client";

import { useState, useEffect } from "react";

interface CodeBlockProps {
  children: React.ReactNode;
  className?: string;
  language?: string;
  filename?: string;
}

export default function CodeBlock({ children, className = "", language = "", filename }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const code = typeof children === "string" ? children : String(children);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div
      className={`relative group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {(filename || language) && (
        <div className="flex items-center justify-between px-4 py-3 border-b border-line bg-paper/5 transition-colors duration-200 group-hover:border-lime/30">
          {filename && (
            <span className="text-xs font-mono text-muted truncate max-w-[200px]">{filename}</span>
          )}
          {language && (
            <span className="text-xs font-mono text-muted/70 ml-2 text-lime/80">{language}</span>
          )}
          <button
            onClick={copyToClipboard}
            className="opacity-0 group-hover:opacity-100 transition-opacity p-2 rounded text-xs font-mono text-muted hover:text-lime hover:bg-paper/10 focus:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-lime"
            aria-label={copied ? "Copied!" : "Copy to clipboard"}
          >
            {copied ? (
              <svg className="w-4 h-4 text-lime" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
            )}
          </button>
        </div>
      )}
      <pre className="p-4 md:p-6 overflow-x-auto bg-ink border border-line rounded-b-xl rounded-t-none relative">
        {isHovered && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-lime/10 via-transparent to-transparent opacity-50" />
        )}
        <code className={`font-mono text-sm md:text-base text-paper/90 ${language ? `language-${language}` : ""}`}>
          {code}
        </code>
      </pre>
    </div>
  );
}