'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/', label: 'Articles' },
  { href: 'https://singhcod3r.github.io/', label: 'Portfolio', external: true },
];

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/blog/';
    return pathname.startsWith(href);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-expo ${
        scrolled ? 'glass-strong py-4' : 'bg-transparent py-6'
      }`}
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <nav className="flex items-center justify-between" aria-label="Main navigation">
          <Link
            href="/"
            className="font-display text-display-sm font-medium text-paper hover:text-lime transition-colors duration-200"
            aria-label="Ayush Singh — Technical Writings"
          >
            Ayush Singh
          </Link>

          <div
            className={`md:flex md:items-center md:gap-8 transition-all duration-300 ease-expo ${
              mobileMenuOpen ? 'fixed inset-0 top-16 bg-ink/95 backdrop-blur-md flex flex-col items-center gap-8 py-12 md:static md:bg-transparent md:py-0' : 'hidden md:flex'
            }`}
            role="navigation"
            aria-label="Primary"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noopener noreferrer' : undefined}
                className={`font-sans text-body-sm font-medium transition-colors duration-200 ${
                  isActive(item.href)
                    ? 'text-lime'
                    : 'text-muted hover:text-paper'
                }`}
                aria-current={isActive(item.href) ? 'page' : undefined}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <button
            className="md:hidden p-2 text-paper hover:text-lime transition-colors duration-200"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-menu"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            id="mobile-menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </nav>
      </div>
    </header>
  );
}