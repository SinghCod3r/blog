import Link from 'next/link';
import { Post } from '../lib/posts';
import { formatDate } from '../lib/posts';

interface ArticleCardProps {
  post: Post;
  featured?: boolean;
}

export default function ArticleCard({ post, featured = false }: ArticleCardProps) {
  const { frontmatter, slug } = post;

  if (featured) {
    return (
      <article className="card group relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-lime/10 via-transparent to-violet/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="tag-accent">{frontmatter.category}</span>
            <time className="text-caption font-mono text-muted" dateTime={frontmatter.date}>
              {formatDate(frontmatter.date)}
            </time>
            {frontmatter.readingTime && (
              <span className="text-caption font-mono text-muted">{frontmatter.readingTime}</span>
            )}
          </div>
          <Link
            href={`/posts/${slug}/`}
            className="block group"
            aria-label={`Read ${frontmatter.title}`}
          >
            <h2 className="font-display text-display-md font-medium text-paper group-hover:text-lime transition-colors duration-300 mb-4">
              {frontmatter.title}
            </h2>
            <p className="text-body-lg text-paper/70 mb-6 line-clamp-3">
              {frontmatter.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-6">
              {frontmatter.tags.slice(0, 5).map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
              {frontmatter.tags.length > 5 && (
                <span className="tag">+{frontmatter.tags.length - 5} more</span>
              )}
            </div>
            <span className="inline-flex items-center gap-2 text-label font-medium text-lime group-hover:gap-3 transition-all duration-300">
              Read article
              <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </Link>
        </div>
      </article>
    );
  }

  return (
    <article className="card group h-full flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <span className="tag">{frontmatter.category}</span>
        <time className="text-caption font-mono text-muted" dateTime={frontmatter.date}>
          {formatDate(frontmatter.date)}
        </time>
        {frontmatter.readingTime && (
          <span className="text-caption font-mono text-muted">{frontmatter.readingTime}</span>
        )}
      </div>
      <Link
        href={`/posts/${slug}/`}
        className="block flex-1 group"
        aria-label={`Read ${frontmatter.title}`}
      >
        <h3 className="font-display text-display-sm font-medium text-paper group-hover:text-lime transition-colors duration-300 mb-3">
          {frontmatter.title}
        </h3>
        <p className="text-body text-paper/70 flex-1 mb-4 line-clamp-2">
          {frontmatter.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {frontmatter.tags.slice(0, 4).map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          {frontmatter.tags.length > 4 && (
            <span className="tag">+{frontmatter.tags.length - 4} more</span>
          )}
        </div>
      </Link>
    </article>
  );
}