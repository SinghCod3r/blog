---
title: "CUPS Website Redesign Proposal — Revised"
description: "Revised proposal for the CUPS public website focusing on CSS, JavaScript, and template improvements while preserving existing documentation sources and leaving room for CUPS 3.0. Updated after technical review and maintainer feedback."
date: "2026-11-09"
category: "Open Source"
tags:
  - OpenPrinting
  - CUPS
  - Web Design
  - Documentation
  - Open Source
  - GitHub Pages
featured: true
readingTime: "12 min read"
---

> **CURRENT PROPOSAL · REVISED NOVEMBER 9, 2026**
>
> This is the revised version of the CUPS website redesign proposal, updated after technical review and maintainer feedback.
>
> **← [View the original proposal](/blog/posts/CUPS_WEBSITE_REDESIGN_PROPOSAL/)**

---

## What Changed From the Original Proposal?

| Area | Original Proposal | Revised Direction |
|---|---|---|
| Embedded UI | Proposed closer visual alignment | Keep largely independent |
| Public website | Broader ecosystem redesign | Focus on CSS, JS, and templates |
| Branding | CUPS blue emphasized | Color direction remains open |
| Documentation | Markdown migration proposed | Preserve existing source documentation |
| Future architecture | Mainly CUPS 2.x | Leave room for CUPS 3.0 |

---

## Introduction

I have been looking at the CUPS website and the OpenPrinting website, and I think there is an opportunity to make them feel more connected. Currently, they feel like separate websites even though CUPS is one of the main OpenPrinting projects.

This revised proposal outlines an updated approach based on technical feedback from a CUPS maintainer. The core goal remains the same, but the implementation direction has been refined to respect technical constraints and architectural decisions.

---

## Goal

The main goal is simple:

> Make the CUPS public website feel like a first-class project inside the OpenPrinting ecosystem, while keeping CUPS's own identity and technical simplicity.

A user should be able to move between:

```
OpenPrinting → CUPS → Documentation → GitHub
```

without feeling that they have entered a completely different website.

The CUPS website should look like a CUPS project within OpenPrinting, not like an unrelated website.

This consistency should include:

* Visual style
* Typography
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

## What I Propose (Revised)

My revised proposal is to **improve the existing CUPS public website in place** — focusing on CSS, JavaScript, and template improvements — rather than rebuilding it as a separate Markdown-based static site.

The proposed architecture is approximately:

```
Existing HTML templates
       ↓
Improved CSS, JS, templates
       ↓
GitHub Pages
```

The existing documentation source in the CUPS source tree remains the single source of truth. The website improves the presentation, navigation, discoverability, and usability of the existing documentation without unnecessarily creating a second source of truth.

I propose we prefer:

* Improving existing HTML templates
* CSS improvements (design tokens, responsive design, accessibility)
* JavaScript improvements where useful (search, navigation, progressive enhancement)
* GitHub Actions
* GitHub Pages

Instead of introducing a Markdown-to-HTML build pipeline or a web framework.

---

## OpenPrinting and CUPS Design Consistency

The CUPS website should reuse the **design principles** of OpenPrinting. Not by copying React components directly, but by sharing the underlying design language.

### What Should Be Shared

* Design tokens (colors, spacing, typography, border radius)
* Typography scale
* Spacing system
* Border radius values
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

## CUPS Identity — Visual Direction Is Open

**CUPS blue is not a mandatory requirement.**

The revised proposal takes the position that the visual identity can be explored more freely. CUPS should remain recognizable as CUPS, but the exact color palette, logo treatment, typography, and visual direction can be evaluated based on what works best for the project.

This means:

* CUPS logo (the cup icon) remains
* CUPS name and project identity remain
* Color direction is open to exploration — not locked to `#0066CC`
* Typography can be evaluated for readability and brand fit
* The goal is a distinctive, professional appearance that signals "CUPS" without mandating a specific hex value

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

## Documentation — Preserve Existing Sources

**Do NOT propose migrating CUPS 2.x documentation to Markdown.**

The existing documentation is served from the original documentation in the CUPS source tree. The revised proposal preserves that approach.

The website should improve the **presentation, navigation, discoverability, and usability** of the existing documentation without unnecessarily creating a second source of truth.

### Key Improvements for Documentation Presentation

* Breadcrumbs on every page (OpenPrinting → CUPS → Section → Page)
* Sticky table of contents sidebar on desktop
* Clear heading hierarchy
* Well-styled code blocks with copy buttons
* Copyable commands
* Client-side search over existing HTML content
* "Edit this page" links pointing to the CUPS source repository
* Mobile-friendly layout
* Accessible navigation
* Clear links between related documents

Man pages should remain an important source for command and API documentation. The existing man page → HTML conversion continues to work as it does today.

---

## Search

The current approach delegates search to DuckDuckGo. I propose a small client-side search index built from the existing HTML documentation at build time.

```
Existing HTML docs
       ↓
Build process (extract text)
       ↓
Search index (JSON)
       ↓
Client-side search (vanilla JS)
```

A tool like Lunr.js or a custom lightweight index can generate a search index at build time. The search would work offline, respect privacy, and not depend on an external service.

The goal is simple: users should be able to quickly find CUPS documentation without leaving the site or depending on an external search engine.

---

## Embedded CUPS Web Interface — Keep Independent

**Do NOT propose significant visual changes to the embedded CUPS web interface.**

The reasons are:

* **CUPS 2.5 is the end of that generation.** The embedded interface in CUPS 2.x is a mature codebase that is not undergoing active visual redesign.
* **CUPS 3.0 uses PAPPL.** The next major version will use PAPPL (Printer Application Framework), which provides its own web interface. Investing in aligning the CUPS 2.x embedded UI is not a good use of effort.
* **Making the embedded interface and public website visually similar has historically caused user confusion.** Users expect the local administration interface to look like a system tool, not a marketing website.
* **The existing embedded "Help" interface is more functional than what is currently hosted online.** The local help system works well for its purpose — it provides context-sensitive help for the admin UI.

Therefore, the revised proposal **focuses primarily on the public CUPS website**, not redesigning the embedded administration interface.

The embedded interface can still benefit from minor accessibility and CSS improvements (focus states, contrast, responsive behavior), but its visual identity and layout should remain largely as-is.

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
Improved HTML templates
CSS improvements
Small vanilla JavaScript (progressive enhancement)
Self-hosted assets (fonts, icons)
GitHub Actions
GitHub Pages
```

Static HTML works forever. Frameworks churn. The CUPS website should still be readable and maintainable in ten years by someone who only knows HTML and CSS.

---

## Design System Approach

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
       (HTML/CSS/JS)
```

A formal npm package (`@openprinting/design-tokens`) can be considered later if multiple OpenPrinting projects need it. For the first implementation, a simple copied/shared CSS token file with a documented update process is more practical.

This avoids unnecessary engineering work while still establishing the consistency we want.

---

## CUPS 3.0 — Future-Proof Architecture

The revised website architecture must **leave room for CUPS 3.0-specific content**.

The proposal allows for version-specific documentation and future CUPS 3.0 information without forcing everything into the current CUPS 2.x structure.

### Version-Aware Structure

```
Documentation
├── CUPS 2.x (current)
│   ├── Getting Started
│   ├── User Guide
│   ├── Administration
│   ├── Developer Guide
│   ├── API Reference
│   ├── Specifications
│   └── Man Pages
├── CUPS 3.0 (future)
│   ├── Getting Started
│   ├── PAPPL Integration
│   ├── Printer Applications
│   ├── Developer Guide
│   └── Migration Guide
└── Version selector (prominent, accessible)
```

The website should:

* Present a clear version selector on documentation pages
* Maintain separate navigation trees per version
* Allow deep linking to version-specific content
* Support "latest" and "stable" version aliases
* Not require restructuring when CUPS 3.0 content is added

---

## Implementation Plan

I do not want to over-plan. Here is a rough phased approach:

### Phase 1 — Design and Prototype

* Confirm visual direction with stakeholders (color direction is open)
* Create CUPS version of OpenPrinting design tokens
* Build header and footer components as HTML partials
* Define token overrides (color direction to be decided)
* Create a few sample pages (home, docs landing, downloads)

### Phase 2 — Core Website

Build the main pages as improved HTML templates:
* Home / Overview
* Documentation landing + structure (version-aware)
* Downloads with version badges and platform cards
* Projects ecosystem page
* Contributing guide
* Security page
* GitHub links

### Phase 3 — Documentation Presentation

Improve existing documentation without migrating sources:
* Add design token CSS to existing doc HTML
* Implement TOC sidebar, search, breadcrumbs via JS enhancement
* Add "Edit this page" links pointing to CUPS source repo
* Ensure mobile-friendly layout
* Version selector implementation

### Phase 4 — Search Implementation

* Build-time extraction of documentation text
* Generate client-side search index
* Implement vanilla JS search UI with keyboard navigation

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
* Migrating CUPS 2.x documentation to Markdown (preserve existing source)
* Depending heavily on external CDNs
* Making CUPS look identical to OpenPrinting
* Replacing CUPS's identity with OpenPrinting branding
* Redesigning the CUPS 2.x embedded admin interface

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
Documentation (version-aware)
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

This revised proposal is a starting point for continued discussion.

If this direction makes sense, I would like to start with a small prototype of the CUPS public website using the OpenPrinting design language, with the color direction left open for stakeholder input. This would make it easier to review the design before doing the full implementation.

I am happy to adjust the approach based on feedback. The goal is to make something that works well for the project long-term.

---

## Proposal History

**v2 — Revised Proposal**  
November 9, 2026  
Current version, refined after technical review.

**v1 — Original Proposal**  
November 7, 2026  
Initial research and proposal.

**[← Read the original proposal](/blog/posts/CUPS_WEBSITE_REDESIGN_PROPOSAL/)**

---

## Author

**Ayush Singh**  
GitHub: [SinghCod3r](https://github.com/SinghCod3r)  
Email: [ayushsinghceee@gmail.com](mailto:ayushsinghceee@gmail.com)  
Telegram: SInghCod3r