import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line py-12 md:py-16" role="contentinfo">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-display-sm font-medium text-paper mb-4">
              Ayush Singh
            </h3>
            <p className="text-body text-paper/70 max-w-xs">
              CSE graduate and Open Source contributor working across Linux, Python, web technologies and developer tooling.
            </p>
          </div>

          <nav aria-label="Footer navigation">
            <h4 className="font-sans label text-muted uppercase tracking-wider mb-4">Navigate</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="link-muted hover:text-lime transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/" className="link-muted hover:text-lime transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <a
                  href="https://singhcod3r.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted hover:text-lime transition-colors"
                >
                  Portfolio
                </a>
              </li>
            </ul>
          </nav>

          <nav aria-label="Connect">
            <h4 className="font-sans label text-muted uppercase tracking-wider mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://github.com/SinghCod3r"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted hover:text-lime transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://singhcod3r.github.io/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link-muted hover:text-lime transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                  Portfolio
                </a>
              </li>
              <li>
                <a
                  href="/rss.xml"
                  className="link-muted hover:text-lime transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M6 18c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
                  </svg>
                  RSS Feed
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-12 pt-8 border-t border-line flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-caption text-muted font-mono">
            © {currentYear} Ayush Singh. Built with Next.js, Tailwind CSS, and care.
          </p>
          <p className="text-caption text-muted font-mono">
            Hosted on GitHub Pages · <a href="/blog/sitemap.xml" className="link-muted hover:text-lime">Sitemap</a> · <a href="/blog/robots.txt" className="link-muted hover:text-lime">Robots</a>
          </p>
        </div>
      </div>
    </footer>
  );
}