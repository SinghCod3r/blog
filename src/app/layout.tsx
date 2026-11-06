import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../styles/globals.css';

const plusJakartaSans = Inter({
  subsets: ['latin'],
  variable: '--font-plus-jakarta-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Ayush Singh — Technical Writings',
    template: '%s | Ayush Singh — Technical Writings',
  },
  description: 'Notes from building, debugging and contributing to real software.',
  authors: [{ name: 'Ayush Singh', url: 'https://github.com/SinghCod3r' }],
  creator: 'Ayush Singh',
  publisher: 'Ayush Singh',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://singhcod3r.github.io/blog/',
    siteName: 'Ayush Singh — Technical Writings',
    title: 'Ayush Singh — Technical Writings',
    description: 'Notes from building, debugging and contributing to real software.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@SinghCod3r',
    creator: '@SinghCod3r',
  },
  icons: {
    icon: '/blog/favicon.ico',
  },
  manifest: '/blog/manifest.json',
};

export const viewport: Viewport = {
  themeColor: '#07080a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakartaSans.variable} scroll-smooth`}>
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="alternate" type="application/rss+xml" title="RSS Feed" href="/blog/rss.xml" />
        <link rel="sitemap" type="application/xml" href="/blog/sitemap.xml" />
      </head>
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pt-20 md:pt-24" id="main-content">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}