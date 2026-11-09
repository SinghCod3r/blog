'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20 text-center" aria-labelledby="error-title">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#ff806d]/15 sm:h-80 sm:w-80" />
      <div className="max-w-xl">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#ff806d]">500 · Something went wrong</p>
        <h1 id="error-title" className="font-display text-display-xl font-semibold text-paper">
          Oops, kuch gadbad ho gayi :)
        </h1>
        <p className="mx-auto mb-8 mt-4 max-w-md text-body-lg text-paper/65">
          Page abhi load nahi ho paaya. Ek baar phir try karein?
        </p>
        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#d8ff58] px-6 py-3 font-semibold text-[#07080a] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8ff58] active:translate-y-0"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-white/15 px-6 py-3 font-semibold text-paper transition-colors hover:border-white/30 hover:bg-white/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8ff58]"
          >
            Back to the blog
          </Link>
        </div>
      </div>
    </section>
  );
}
