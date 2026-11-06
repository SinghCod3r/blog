import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center animate-in">
        <h1 className="font-display text-display-xl md:text-display-lg font-medium text-paper mb-4">
          404
        </h1>
        <p className="text-body-lg text-paper/60 mb-8 max-w-md mx-auto">
          This page got lost somewhere between the terminal and production.
        </p>
        <Link href="/" className="btn-primary inline-flex">
          ← Back to articles
        </Link>
      </div>
    </div>
  );
}