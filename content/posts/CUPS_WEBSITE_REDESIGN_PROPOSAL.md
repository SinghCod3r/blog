---
title: "CUPS Website Redesign Proposal"
description: "A proposal for integrating the CUPS website more closely with the OpenPrinting ecosystem while preserving CUPS identity, documentation, and technical simplicity."
date: "2026-11-07"
category: "Open Source"
tags:
  - OpenPrinting
  - CUPS
  - Web Design
  - Documentation
  - Open Source
  - GitHub Pages
featured: true
readingTime: "10 min read"
archived: true
---

> **REVISED PROPOSAL AVAILABLE**
>
> This is the original version of the CUPS website redesign proposal, published on November 7, 2026. A revised version is now available following technical review.
>
> **[Read the Revised Proposal →](/blog/posts/cups-website-redesign-proposal-revised/)**

---

## Introduction

I have been looking at the CUPS website and the OpenPrinting website, and I think there is an opportunity to make them feel more connected. Currently, they feel like separate websites even though CUPS is one of the main OpenPrinting projects.

This proposal outlines what I think could be improved and how. It is based on a detailed comparison of both websites — their design, structure, technology, and how users move between them.

The goal is not to rebuild everything from scratch. It is to make the CUPS website feel like a natural part of OpenPrinting while keeping CUPS's own identity and technical simplicity.

---

## Goal

The main goal is simple:

> Make the CUPS website feel like a first-class project inside the OpenPrinting ecosystem, while keeping CUPS's own identity and technical simplicity.

A user should be able to move between:

```
OpenPrinting → CUPS → Documentation → GitHub
```

without feeling that they have entered a completely different website.

The CUPS website should look like a CUPS project within OpenPrinting, not like an unrelated website.

This consistency should include:

* Visual style
* Typography
* Colors and design tokens
* Navigation patterns
* Buttons
* Cards
* Documentation layout
* Search behavior
* Mobile behavior
* Accessibility
* General interaction patterns

At the same time, CUPS must retain:

* CUPS logo
* CUPS name
* CUPS blue
* CUPS-specific navigation
* CUPS-specific documentation
* CUPS project ecosystem
* CUPS administration interface
* CUPS technical identity

---

## Current Situation

Right now, CUPS and OpenPrinting feel like separate websites.

**OpenPrinting** is built with Next.js, React, and Tailwind CSS. It has a modern design system with design tokens, a frosted-glass header, a search modal, dark mode, and a component library.

**The CUPS public website** (at `openprinting.github.io/cups/`) uses Bootstrap 5 from a CDN. It has a different header, different colors, different buttons, and a different documentation layout.

**The CUPS embedded web interface** (the admin UI at `localhost:631`) uses its own templates and CSS. It loads Google Fonts, has fixed headers and footers that break printing, and includes frame-busting JavaScript that is not needed for a local interface.

**The CUPS documentation** is spread across 80+ static HTML files in `/doc/help/`. These are duplicated on the GitHub Pages site, which creates a maintenance burden and drift risk.

None of these three feel like they belong to the same family. A user moving from OpenPrinting to CUPS experiences a visual and behavioral disconnect.

This is not a criticism of the existing work. The websites function. But they could be:

* More consistent with each other
* Easier to navigate
* Easier to maintain
* Easier for new users to understand
* Better connected to the OpenPrinting ecosystem

---

## What I Propose

My proposal is to rebuild the CUPS public website as a **simple static documentation and project website built from Markdown**, using the OpenPrinting design language while retaining CUPS-specific branding and content.

The proposed architecture is approximately:

```
Markdown
   ↓
Static build process
   ↓
HTML + CSS + JavaScript
   ↓
GitHub Pages
```

The same documentation source would serve both the public website and the embedded web interface (via a symlink at build time). This reduces duplication and makes maintenance easier.

I propose we prefer:

* Static HTML
* Markdown
* CSS
* Small amounts of vanilla JavaScript
* GitHub Actions
* GitHub Pages

Instead of introducing a large web framework only for the website.

---

## OpenPrinting and CUPS Design Consistency

This is one of the most important parts of the proposal.

The CUPS website should reuse the **design principles** of OpenPrinting. Not by copying React components directly, but by sharing the underlying design language.

### What Should Be Shared

* Design tokens (colors, spacing, typography, border radius)
* Typography scale
* Spacing system
* Border radius values
* Color palette (with CUPS blue as the primary override)
* Button patterns (variants, sizes, focus states)
* Card patterns (hover lift, glow, structure)
* Documentation styling (prose, code blocks, tables)
* Form styling (inputs, selects, textareas)
* Accessibility patterns (focus-visible, ARIA, heading hierarchy)
* Responsive behavior (breakpoints, mobile drawer pattern)

### What Should NOT Be Shared Directly

* React Navbar component
* Next.js-specific components
* React Footer component
* Framer Motion animations
* React state management
* OpenPrinting-specific routing
* Algolia search implementation

The two projects can use the same design language while still using technologies appropriate for each project. OpenPrinting uses React and Next.js because it needs them. CUPS does not.

---

## CUPS Identity

This is not a proposal to remove CUPS branding.

The website should have both identities clearly visible:

```
OpenPrinting
     ↓
    CUPS
```

### Possible Header Concept

```
[OpenPrinting Logo]    [CUPS Logo] CUPS

Home    Documentation    Downloads    Projects    Contributing    GitHub
```

The exact navigation can be adjusted during implementation. The OpenPrinting logo links to the OpenPrinting homepage. The CUPS logo links to the CUPS overview page.

CUPS must retain:

* CUPS logo (the cup icon)
* CUPS blue (`#0066CC` — darker than OpenPrinting cyan)
* CUPS tagline ("The standards-based, open source printing system")
* CUPS project name
* CUPS-specific content and documentation
* CUPS administration interface
* CUPS technical identity

The user should understand: "I am looking at CUPS, and CUPS is part of OpenPrinting."

---

## Proposed Website Structure

I propose the following structure under OpenPrinting:

```
OpenPrinting
└── Projects
    └── CUPS
        ├── Overview
        ├── Documentation
        ├── Downloads
        ├── Projects
        ├── Contributing
        ├── Security
        └── GitHub
```

### Why These Sections?

| Section | Purpose |
|---------|---------|
| **Overview** | What is CUPS? Quick links for users, admins, developers, distributors |
| **Documentation** | All documentation with clear hierarchy, search, TOC |
| **Downloads** | Releases, packages, Docker, platform links with version badges |
| **Projects** | Ecosystem cards: libcups, cups-filters, cups-browsed, ipp-usb, printer-applications |
| **Contributing** | Code, docs, translations, testing, reporting — one unified guide |
| **Security** | Security policy, reporting, advisories |
| **GitHub** | Direct links to repo, issues, PRs, discussions, wiki |

The website should make the following information easy to find:

* What is CUPS?
* How do I install CUPS?
* Where is the documentation?
* Where can I download it?
* How do I contribute?
* Where is the source code?
* Where can I report a bug?
* What projects are related to CUPS?
* Where can I find developer information?

---

## Documentation

Documentation should be a major focus. The current 80+ static HTML files should be reviewed and gradually migrated toward a structured Markdown-based system.

### Suggested Documentation Structure

```
Documentation
├── Getting Started
├── User Guide
├── Administration
├── Developer Guide
├── API Reference
├── Specifications
└── Man Pages
```

I do not propose converting everything immediately. An incremental migration makes more sense — start with the most important pages, then expand.

### Important Features

* Breadcrumbs on every page (OpenPrinting → CUPS → Section → Page)
* Sticky table of contents sidebar on desktop
* Clear heading hierarchy
* Well-styled code blocks with copy buttons
* Copyable commands
* Client-side search
* "Edit this page" links pointing to GitHub source
* Mobile-friendly layout
* Accessible navigation
* Clear links between related documents

Man pages should remain an important source for command and API documentation. The build process can convert them to HTML automatically.

---

## Search

The current approach delegates search to DuckDuckGo. I propose a small client-side search index instead.

```
Markdown
   ↓
Build process
   ↓
Search index
   ↓
Client-side search
```

A tool like Lunr.js can generate a search index at build time. The search would work offline, respect privacy, and not depend on an external service.

The goal is simple: users should be able to quickly find CUPS documentation without leaving the site or depending on an external search engine.

---

## Embedded CUPS Web Interface

Important distinction: the CUPS web administration interface at `localhost:631` is **not** the same thing as the public CUPS website.

* The embedded interface is an administration UI for managing printers, jobs, and classes.
* The public website is documentation, project information, downloads, contribution guides, and development information.

They serve different purposes. However, they should still share a consistent visual language where practical.

I suggest carefully aligning:

* Colors (using the same design tokens)
* Typography
* Buttons
* Forms
* Spacing
* Accessibility patterns

Without making the local administration UI unnecessarily complicated.

The existing administrative navigation should remain:

```
Home    Administration    Classes    Help    Jobs    Printers
```

The "Help" tab could link to the public documentation site. The header could use the same tokens and show a link to the public website.

---

## Accessibility

Accessibility should not be an afterthought. It should be part of the normal website design.

Important improvements include:

* Skip-to-content link
* Visible keyboard focus on all interactive elements
* Proper heading hierarchy (h1 → h2 → h3, no skips)
* Semantic HTML (`<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`)
* ARIA labels where required (icon buttons, expandable sections)
* Accessible forms (associated labels, error descriptions)
* Good color contrast (WCAG AA minimum)
* Mobile-friendly controls (minimum 44×44px touch targets)
* Reduced-motion support (`prefers-reduced-motion`)
* Keyboard-friendly navigation throughout

---

## Performance and Dependencies

I favor a small dependency footprint. This is especially appropriate for a long-lived open-source infrastructure project.

### Avoid

* JavaScript frameworks (React, Vue, Next.js, Astro, etc.)
* External CDNs for critical assets
* Tracking and analytics
* Complex animations
* CMS systems
* Backend services
* Database systems

### Prefer

```
Static HTML
CSS
Small vanilla JavaScript
Self-hosted assets (fonts, icons)
GitHub Actions
GitHub Pages
```

Static HTML works forever. Frameworks churn. The CUPS website should still be readable and maintainable in ten years by someone who only knows HTML and CSS.

---

## Design System Proposal

I do not propose immediately creating a large shared component library. That would be over-engineering for the first version.

Instead, start small:

```
OpenPrinting Design Tokens
        ↓
--------------------------
Colors
Typography
Spacing
Radius
Buttons
Cards
Forms
Documentation styles
Accessibility
--------------------------
        ↓
   CUPS Website
```

A formal npm package (`@openprinting/design-tokens`) can be considered later if multiple OpenPrinting projects need it. For the first implementation, a simple copied/shared CSS token file with a documented update process is more practical.

This avoids unnecessary engineering work while still establishing the consistency we want.

---

## Three Possible Approaches

Based on my research, here are three directions:

### Option A — Minimal Evolution

Keep the current Bootstrap-based website and restyle it to look more like OpenPrinting.

**Advantages:**
* Fast to implement
* Low migration cost

**Problems:**
* Bootstrap remains as a dependency
* Documentation remains fragmented across static HTML files
* OpenPrinting consistency is mostly visual, not behavioral
* Long-term maintenance problems remain

### Option B — Strong OpenPrinting Integration (Recommended)

Create a static CUPS website using Markdown and a simple build system, adopting the OpenPrinting design language.

**Advantages:**
* Strong consistency with OpenPrinting (visual and behavioral)
* Better documentation structure with hierarchy, TOC, search
* Lower long-term dependency burden (no framework, no CDNs)
* Single source of documentation for public site and embedded UI
* Better maintainability
* Can be implemented incrementally
* Leaves room for a larger shared design system later

### Option C — Shared Ecosystem Design System

Create a formal OpenPrinting design system and component ecosystem used by all projects.

**Advantages:**
* Maximum consistency across all OpenPrinting projects
* Can benefit multiple projects

**Problems:**
* Significantly more work upfront
* More ongoing maintenance
* Potential over-engineering for current needs
* Requires maintaining two component implementations (React + vanilla)

This is something that can be considered later, not something required for the first version.

---

## Recommended Approach

I recommend **Option B — Strong OpenPrinting Integration**.

The main reasons:

1. It gives CUPS a stronger connection to OpenPrinting.
2. It keeps CUPS's own identity (logo, blue, content, navigation).
3. It avoids unnecessary web frameworks.
4. It improves documentation structure and discoverability.
5. It reduces duplicated content between the public site and embedded UI.
6. It makes the website easier to maintain long-term.
7. It can be implemented incrementally.
8. It leaves room for a larger shared OpenPrinting design system later if needed.

---

## Implementation Plan

I do not want to over-plan. Here is a rough phased approach:

### Phase 1 — Design and Prototype

* Confirm visual direction with stakeholders
* Create CUPS version of OpenPrinting design tokens
* Build header and footer components
* Define token overrides (CUPS blue)
* Create a few sample pages (home, docs landing, downloads)

### Phase 2 — Core Website

Build the main pages:
* Home / Overview
* Documentation landing + structure
* Downloads with version badges and platform cards
* Projects ecosystem page
* Contributing guide
* Security page
* GitHub links

### Phase 3 — Documentation

Gradually migrate and organize existing documentation:
* Start with highest-traffic pages
* Convert to MarkDown with proper frontmatter
* Implement TOC sidebar, search, breadcrumbs
* Add "Edit this page" links
* Set up man page → HTML conversion

### Phase 4 — Embedded UI Alignment

Align the CUPS local web interface where appropriate:
* Update `cups.css` to use shared design tokens
* Remove fixed footer and frame-busting JavaScript
* Verify `localhost:631/help/` works with symlinked content
* Keep administrative navigation intact

### Phase 5 — Accessibility and Testing

Test across:
* Desktop (Chrome, Firefox, Safari)
* Mobile (iOS Safari, Android Chrome)
* Keyboard-only navigation
* Screen readers (NVDA, VoiceOver)
* Dark/light system preference
* Print stylesheets
* Different viewport sizes

### Phase 6 — Deployment

Deploy through GitHub Actions to GitHub Pages. Set up PR previews for review.

I am not promising an exact timeline. The work can be done incrementally and reviewed at each step.

---

## What I Would Avoid

To keep the project focused and maintainable:

* Rewriting the entire site in React just because OpenPrinting uses React
* Adding Next.js to CUPS without a real need
* Creating a CMS
* Adding a database
* Adding analytics or tracking
* Adding unnecessary animations
* Building a complex design system before testing the basic idea
* Keeping duplicate documentation
* Depending heavily on external CDNs
* Making CUPS look identical to OpenPrinting
* Replacing CUPS's identity with OpenPrinting branding

**Consistency does not mean making every OpenPrinting project identical.** CUPS should look like CUPS, within the OpenPrinting family.

---

## Expected Result

If this works well, the user experience would feel like:

```
OpenPrinting
     ↓
Projects
     ↓
CUPS
     ↓
Documentation
     ↓
GitHub
```

All of these belong to the same ecosystem. At the same time:

```
OpenPrinting
    = ecosystem identity

CUPS
    = project identity
```

This distinction is very important. The user should always know: "I am in CUPS, and CUPS is part of OpenPrinting."

---

## Next Step

This proposal is a starting point for discussion.

If this direction makes sense, I would like to start with a small prototype of the CUPS website using the OpenPrinting design language. This would make it easier to review the design before doing the full migration.

I am happy to adjust the approach based on feedback. The goal is to make something that works well for the project long-term.

---

## Author

**Ayush Singh**  
GitHub: [SinghCod3r](https://github.com/SinghCod3r)  
Email: [ayushsinghceee@gmail.com](mailto:ayushsinghceee@gmail.com)  
Telegram: SInghCod3r