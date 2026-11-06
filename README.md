# Ayush Singh — Technical Writings

A standalone technical blog built with Next.js, React, TypeScript, and Tailwind CSS. Deployed to GitHub Pages at `https://singhcod3r.github.io/blog/`.

## Tech Stack

- **Framework**: Next.js 14 (App Router, Static Export)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Content**: Markdown with frontmatter (gray-matter)
- **Markdown Processing**: remark/rehype (GFM, syntax highlighting, auto-linking headings)
- **Deployment**: GitHub Actions → GitHub Pages
- **Fonts**: Plus Jakarta Sans, Syne, Instrument Serif, JetBrains Mono (self-hosted via Google Fonts)

## Project Structure

```
blog/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment workflow
├── content/
│   └── posts/                  # Markdown blog posts
│       └── system-config-printer-contributions.md
├── public/
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   └── manifest.json           # PWA manifest
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout with SEO, fonts
│   │   ├── page.tsx            # Homepage
│   │   ├── not-found.tsx       # 404 page
│   │   ├── posts/
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # Article page (static params)
│   │   ├── rss.xml/
│   │   │   └── route.ts        # RSS feed generation
│   │   ├── sitemap.xml/
│   │   │   └── route.ts        # Sitemap generation
│   │   └── robots.txt/
│   │       └── route.ts        # Robots.txt generation
│   ├── components/
│   │   ├── Header.tsx          # Navigation header
│   │   ├── Footer.tsx          # Site footer
│   │   ├── ArticleCard.tsx     # Article preview card
│   │   ├── ArticleLayout.tsx   # Article page layout
│   │   ├── TableOfContents.tsx # Sticky TOC (desktop) / collapsible (mobile)
│   │   └── CodeBlock.tsx       # Code block with copy button
│   ├── lib/
│   │   ├── posts.ts            # Markdown parsing, frontmatter, post utilities
│   │   └── seo.ts              # SEO metadata, JSON-LD structured data
│   └── styles/
│       └── globals.css         # Tailwind + custom design system
├── next.config.js              # Next.js config (basePath: /blog)
├── tailwind.config.js          # Tailwind config with design tokens
├── tsconfig.json               # TypeScript config
├── package.json
└── README.md
```

## Design System

The blog uses a custom design system matching the main portfolio:

```css
--ink: #07080a;        /* Background */
--paper: #f0f0e9;      /* Primary text */
--muted: #989c99;      /* Secondary text */
--lime: #d8ff58;       /* Primary accent */
--violet: #a786ff;     /* Secondary accent */
--coral: #ff806d;      /* Tertiary accent */
--cyan: #7ff3da;       /* Code accent */
--line: rgba(240, 240, 233, 0.12); /* Borders */

Fonts:
- Plus Jakarta Sans — Body/UI
- Syne — Major headings
- Instrument Serif — Editorial italics
- JetBrains Mono — Technical metadata, code, labels
```

## Getting Started

### Prerequisites

- Node.js 20+
- npm

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:3000/blog/` (the base path is applied in development).

### Build

```bash
npm run build
```

The static output will be in the `out/` directory, ready for GitHub Pages.

### Preview Production Build Locally

```bash
npx serve out -l 3000
# Visit http://localhost:3000/blog/
```

## Creating a Post

### 1. Create Markdown File

Add a `.md` file to `content/posts/`:

```bash
content/posts/my-new-article.md
```

### 2. Add Frontmatter

```yaml
---
title: "Your Article Title"
description: "A brief description for SEO and previews (1-2 sentences)."
date: "2026-11-06"
category: "Open Source"
tags:
  - Tag1
  - Tag2
  - Tag3
featured: false
readingTime: "8 min read"
cover: "/path/to/cover-image.png"  # optional
updated: "2026-11-07"              # optional
---
```

### 3. Write Content

Use standard Markdown with GFM extensions:

- Headings (`##`, `###`)
- Paragraphs, **bold**, *italic*
- Lists (ordered/unordered)
- Blockquotes
- Inline `code` and fenced code blocks with language
- Tables
- Images
- Horizontal rules

### 4. Add Images

Place images in `public/images/` and reference them:

```markdown
![Alt text](/blog/images/my-image.png)
```

### 5. Commit and Push

```bash
git add content/posts/my-new-article.md
git commit -m "Add article: Your Article Title"
git push origin main
```

GitHub Actions will build and deploy automatically.

## Phone Publishing Workflow

**No local development environment needed.** Create/edit posts directly from your phone:

1. Open the repository on GitHub mobile/web: `https://github.com/SinghCod3r/blog`
2. Navigate to `content/posts/`
3. Click **Add file** → **Create new file**
4. Name it: `your-article-slug.md`
5. Paste the frontmatter + Markdown content
6. Click **Commit changes**
7. GitHub Actions builds and deploys
8. Live at `https://singhcod3r.github.io/blog/posts/your-article-slug/`

## Deployment

### GitHub Pages Configuration

The repository must be configured for **GitHub Actions** deployment:

1. Go to **Settings** → **Pages**
2. **Build and deployment** → **Source** → **GitHub Actions**
3. The workflow (`.github/workflows/deploy.yml`) handles the rest

### Production URL

```
https://singhcod3r.github.io/blog/
```

### URL Structure

| Route | Path |
|-------|------|
| Homepage | `/blog/` |
| Article | `/blog/posts/<slug>/` |
| RSS Feed | `/blog/rss.xml` |
| Sitemap | `/blog/sitemap.xml` |
| Robots | `/blog/robots.txt` |

### Next.js Base Path

The `next.config.js` uses:

```js
basePath: '/blog'
assetPrefix: '/blog/'
trailingSlash: true
output: 'export'
```

This ensures all assets resolve correctly under `/blog/` on GitHub Pages.

## Generated Files

The build produces a fully static site in `out/`:

- `out/index.html` — Homepage
- `out/posts/<slug>/index.html` — Article pages
- `out/rss.xml` — RSS 2.0 feed
- `out/sitemap.xml` — XML sitemap
- `out/robots.txt` — Robots.txt
- `out/_next/static/...` — CSS, JS, fonts
- `out/404.html` — Custom 404 page

## SEO Features

Each article includes:

- **Meta tags**: title, description, canonical URL
- **Open Graph**: title, description, image, type, author
- **Twitter Card**: summary_large_image
- **JSON-LD**: `TechArticle` structured data
- **Sitemap**: All pages with lastmod, changefreq, priority
- **RSS**: Full content feed with categories

## Accessibility

- Semantic HTML5
- Keyboard navigation
- Focus visible states
- Alt text for images
- Proper heading hierarchy
- ARIA labels
- `prefers-reduced-motion` respected
- Color contrast (WCAG AA)

## Performance

- Static HTML (no client-side hydration for content)
- Minimal JavaScript (only interactive components)
- Self-hosted fonts with `font-display: swap`
- Optimized images (when added)
- CSS-only animations
- No external dependencies at runtime

## License

MIT License — see [LICENSE](LICENSE) for details.

---

**Author**: Ayush Singh  
**Portfolio**: https://singhcod3r.github.io/  
**GitHub**: https://github.com/SinghCod3r