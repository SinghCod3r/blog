import { getAllPosts, getFeaturedPost, formatDate } from '../lib/posts';
import ArticleCard from '../components/ArticleCard';
import Link from 'next/link';
import { generateSEO, generateWebsiteJSONLD, SITE_URL } from '../lib/seo';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  ...generateSEO({
    title: 'Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
    canonicalUrl: SITE_URL,
  }),
  openGraph: {
    title: 'Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
    url: SITE_URL,
    type: 'website',
  },
};

export default function HomePage() {
  const posts = getAllPosts();
  const featuredPost = getFeaturedPost();
  const otherPosts = featuredPost ? posts.filter(p => p.slug !== featuredPost.slug) : posts;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteJSONLD()) }}
      />

      <section className="relative min-h-screen flex items-center justify-center pt-20 pb-16 md:pb-24" aria-labelledby="hero-heading">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-lime/5 via-transparent to-violet/5" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%23f0f0e9%22 fill-opacity=%220.02%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 text-center">
          <div className="animate-in mb-8">
            <span className="inline-flex items-center gap-2 label font-medium text-lime uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-lime animate-pulse" />
              Technical Writings
            </span>
          </div>

          <h1 id="hero-heading" className="font-display text-display-xl md:text-display-lg font-medium text-paper mb-6 animate-in delay-100 text-balance">
            Notes from building, debugging and contributing to real software.
          </h1>

          <p className="text-body-lg md:text-body-lg text-paper/60 max-w-2xl mx-auto animate-in delay-200">
            A personal engineering publication covering Linux systems, open source contribution, developer tooling, and the craft of debugging complex software.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in delay-300">
            <Link href="/rss.xml" className="btn-secondary">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 18c0 2.21 1.79 4 4 4s4-1.79 4-4-1.79-4-4-4-4 1.79-4 4zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zm0-6c0 1.1.9 2 2 2s2-.9 2-2-.9-2-2-2-2 .9-2 2zM4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
              </svg>
              Subscribe via RSS
            </Link>
            <a
              href="https://github.com/SinghCod3r"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </section>

      {featuredPost && (
        <section className="py-16 md:py-24" aria-labelledby="featured-heading">
          <div className="mx-auto max-w-7xl px-4 md:px-8">
            <header className="mb-12">
              <div className="flex items-center gap-3 mb-4">
                <span className="w-1 h-6 bg-lime" />
                <h2 id="featured-heading" className="font-display text-display-md font-medium text-paper">
                  Featured Article
                </h2>
              </div>
              <p className="text-body text-paper/60 max-w-2xl">
                The latest deep-dive into real-world engineering challenges.
              </p>
            </header>

            <ArticleCard post={featuredPost} featured />
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-paper/5" aria-labelledby="articles-heading">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="w-1 h-6 bg-lime" />
              <h2 id="articles-heading" className="font-display text-display-md font-medium text-paper">
                Latest Articles
              </h2>
            </div>
            <p className="text-body text-paper/60 max-w-2xl">
              All published writings, newest first.
            </p>
          </header>

          {otherPosts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {otherPosts.map((post, index) => (
                <ArticleCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-body text-paper/60">
                No articles yet. Check back soon!
              </p>
            </div>
          )}

          {posts.length === 0 && (
            <div className="text-center py-16">
              <p className="text-body text-paper/60 mb-6">
                No articles published yet.
              </p>
              <p className="text-body-sm text-muted font-mono">
                Add a Markdown file to <code>content/posts/</code> to get started.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24" aria-labelledby="about-heading">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-1 h-6 bg-lime" />
                <h2 id="about-heading" className="font-display text-display-md font-medium text-paper">
                  About the Author
                </h2>
              </div>
              <div className="prose-custom max-w-none">
                <p className="text-body-lg text-paper/80 mb-6">
                  I'm Ayush Singh, a CSE graduate and Open Source contributor working across Linux, Python, web technologies and developer tooling.
                </p>
                <p className="text-body text-paper/70 mb-6">
                  This blog documents my journey contributing to real-world projects like <strong>system-config-printer</strong> (OpenPrinting), where I've worked on GTK UI freezes, printer discovery, driverless printing, IPP/IPP-over-USB, asynchronous operations, and multi-protocol printer handling.
                </p>
                <p className="text-body text-paper/70 mb-6">
                  The writings here focus on technical depth over breadth — explaining not just what was fixed, but why it was broken, how the fix works, and what it teaches about systems programming.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://github.com/SinghCod3r" target="_blank" rel="noopener noreferrer" className="btn-primary">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub
                  </a>
                  <a href="https://singhcod3r.github.io/" target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    Portfolio
                  </a>
                </div>
              </div>
            </div>

            <div className="glass p-8 lg:sticky lg:top-24">
              <h3 className="font-display text-display-sm font-medium text-paper mb-6">Categories</h3>
              <div className="space-y-3">
                <Link href="/" className="block p-4 glass hover:bg-paper/10 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-paper group-hover:text-lime transition-colors">Open Source</span>
                    <span className="text-caption font-mono text-muted">1 article</span>
                  </div>
                  <p className="text-body-sm text-paper/60 mt-1">Contributing to upstream projects</p>
                </Link>
                <Link href="/" className="block p-4 glass hover:bg-paper/10 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-paper group-hover:text-lime transition-colors">Linux Systems</span>
                    <span className="text-caption font-mono text-muted">1 article</span>
                  </div>
                  <p className="text-body-sm text-paper/60 mt-1">Kernel, userspace, and desktop</p>
                </Link>
                <Link href="/" className="block p-4 glass hover:bg-paper/10 transition-colors group">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-paper group-hover:text-lime transition-colors">Debugging</span>
                    <span className="text-caption font-mono text-muted">1 article</span>
                  </div>
                  <p className="text-body-sm text-paper/60 mt=1">Finding and fixing real bugs</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}