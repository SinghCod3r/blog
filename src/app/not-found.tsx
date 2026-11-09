import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden px-5 py-20 text-center" aria-labelledby="not-found-title">
      <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#d8ff58]/10 sm:h-80 sm:w-80" />
      <div className="max-w-xl animate-in">
        <p className="mb-4 font-mono text-xs font-medium uppercase tracking-[0.2em] text-[#d8ff58]">404 · Page not found</p>
        <h1 id="not-found-title" className="font-display text-display-xl font-semibold text-paper">
          Aab nahi milega :)
        </h1>
        <p className="mx-auto mb-8 mt-4 max-w-md text-body-lg text-paper/65">
          Yeh page kahin aur chala gaya. Chalo, blog par wapas chalte hain.
        </p>
        <Link href="/" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#d8ff58] px-6 py-3 font-semibold text-[#07080a] transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d8ff58] active:translate-y-0">
          <span aria-hidden="true">←</span>
          Back to the blog
        </Link>
      </div>
    </section>
  );
}
