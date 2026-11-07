import type { Metadata, Viewport } from 'next';
import SmoothScrollProvider from '../components/SmoothScrollProvider';
import '../styles/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://singhcod3r.github.io'),
  title: {
    default: 'Ayush Singh — Technical Writings',
    template: '%s | Ayush Singh — Technical Writings',
  },
  description: 'Notes from building, debugging and contributing to real software.',
  authors: [{ name: 'Ayush Singh', url: 'https://github.com/SinghCod3r' }],
  creator: 'Ayush Singh (SinghCod3r)',
  publisher: 'Ayush Singh',
  robots: 'index, follow',
  alternates: {
    canonical: '/blog/',
    types: {
      'application/rss+xml': '/blog/rss.xml',
    },
  },
  verification: {
    google: 'njBiYD1R5mTuY_37h2XR498birTtkrHu1GFUzc71LZ8',
    other: {
      'msvalidate.01': '5B421CE2BB30697AF2642AA61F17F7A9',
    },
  },
  keywords: [
    'Ayush Singh',
    'SinghCod3r',
    'Linux Systems Engineer',
    'OpenPrinting',
    'The Linux Foundation',
    'CUPS',
    'Google Summer of Code',
    'GSoC 2024',
    'Python Developer',
    'Printer Support Resolver',
    'system-config-printer',
    'Open Source Contributor',
    'Technical Blog',
    'Software Engineering',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://singhcod3r.github.io/blog/',
    siteName: 'Ayush Singh — Technical Writings',
    title: 'Ayush Singh — Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
    images: [
      {
        url: 'https://singhcod3r.github.io/hero_collage_desktop.webp',
        width: 1200,
        height: 630,
        alt: 'Ayush Singh (SinghCod3r) Technical Writings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SinghCod3r',
    creator: '@SinghCod3r',
    title: 'Ayush Singh — Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
    images: ['https://singhcod3r.github.io/hero_collage_desktop.webp'],
  },
  icons: {
    icon: '/blog/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: '#07080a',
  width: 'device-width',
  initialScale: 1,
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Person',
      '@id': 'https://singhcod3r.github.io/#person',
      name: 'Ayush Singh',
      alternateName: ['SinghCod3r', 'Ayush', 'singhcod3r'],
      url: 'https://singhcod3r.github.io',
      jobTitle: 'Software Developer & Linux Systems Contributor',
      description:
        'Software developer, open-source maintainer, and Linux systems engineer specializing in CUPS printing architecture, Python developer tooling, and modern web applications.',
      worksFor: {
        '@type': 'Organization',
        name: 'OpenPrinting / The Linux Foundation',
        url: 'https://openprinting.github.io',
      },
      alumniOf: {
        '@type': 'EducationalOrganization',
        name: 'Google Summer of Code (GSoC)',
        url: 'https://summerofcode.withgoogle.com',
      },
      sameAs: [
        'https://github.com/SinghCod3r',
        'https://singhcod3r.medium.com/',
        'https://www.linkedin.com/in/singhcod3r',
        'https://x.com/SinghCod3r',
      ],
      knowsAbout: [
        'Linux Systems Programming',
        'OpenPrinting Architecture',
        'CUPS (Common UNIX Printing System)',
        'Python Developer Tooling',
        'Compiler & Interpreter Design',
        'Full-stack Web Development',
        'Next.js & React',
        'TypeScript',
        'AI Agent Containment & Security',
      ],
      knowsLanguage: ['en', 'hi'],
      mainEntityOfPage: 'https://singhcod3r.github.io',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://singhcod3r.github.io/blog/#website',
      url: 'https://singhcod3r.github.io/blog/',
      name: 'Ayush Singh — Technical Writings',
      description: 'Official technical blog and engineering dispatches of Ayush Singh (SinghCod3r).',
      publisher: {
        '@id': 'https://singhcod3r.github.io/#person',
      },
      inLanguage: 'en-US',
    },
    {
      '@type': 'ProfilePage',
      '@id': 'https://singhcod3r.github.io/blog/#profilepage',
      url: 'https://singhcod3r.github.io/blog/',
      name: 'Ayush Singh (SinghCod3r) Technical Blog',
      mainEntity: {
        '@id': 'https://singhcod3r.github.io/#person',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="google-site-verification" content="njBiYD1R5mTuY_37h2XR498birTtkrHu1GFUzc71LZ8" />
        <meta name="msvalidate.01" content="5B421CE2BB30697AF2642AA61F17F7A9" />
        <link rel="sitemap" type="application/xml" title="Sitemap" href="/blog/sitemap.xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
        />
      </head>
      <body className="antialiased selection:bg-[#d8ff58] selection:text-[#07080a] bg-[#07080a] text-[#f0f0e9] min-h-screen flex flex-col">
        <main className="flex-1" id="main-content">
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </main>
      </body>
    </html>
  );
}