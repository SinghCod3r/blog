import { Post } from '../lib/posts';
import { formatDate, calculateReadingTime } from '../lib/posts';
import TableOfContents from './TableOfContents';
import CodeBlock from './CodeBlock';
import Link from 'next/link';

interface ArticleLayoutProps {
  post: Post;
}

export default function ArticleLayout({ post }: ArticleLayoutProps) {
  const { frontmatter, htmlContent, headings, slug } = post;
  const readingTime = frontmatter.readingTime || calculateReadingTime(post.content);

  return (
    <article className="prose-custom" itemScope itemType="https://schema.org/TechArticle">
      <header className="mb-12 md:mb-16 animate-in">
        <div className="flex items-center gap-3 mb-6 animate-in delay-100">
          <span className="tag-accent">{frontmatter.category}</span>
          <time
            itemProp="datePublished"
            className="text-caption font-mono text-muted"
            dateTime={frontmatter.date}
          >
            {formatDate(frontmatter.date)}
          </time>
          {frontmatter.updated && (
            <time
              itemProp="dateModified"
              className="text-caption font-mono text-muted"
              dateTime={frontmatter.updated}
            >
              Updated {formatDate(frontmatter.updated)}
            </time>
          )}
          <span className="text-caption font-mono text-muted">{readingTime}</span>
        </div>

        <h1 itemProp="headline" className="font-display text-display-xl md:text-display-lg font-medium text-paper animate-in delay-200">
          {frontmatter.title}
        </h1>

        <p itemProp="description" className="text-body-lg text-paper/70 max-w-2xl animate-in delay-300">
          {frontmatter.description}
        </p>

        <div className="flex flex-wrap gap-2 mt-8 animate-in delay-400" role="list" aria-label="Tags">
          {frontmatter.tags.map((tag) => (
            <span key={tag} className="tag" role="listitem">{tag}</span>
          ))}
        </div>
      </header>

      <div className="grid lg:grid-cols-[1fr_220px] gap-12 lg:gap-16">
        <div className="min-w-0">
          <div
            className="prose-custom"
            itemProp="articleBody"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        </div>

        <TableOfContents headings={headings} />
      </div>

      <footer className="mt-16 pt-8 border-t border-line animate-in">
        <nav className="flex items-center justify-between" aria-label="Article navigation">
          <Link
            href="/"
            className="btn-secondary group"
          >
            <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to articles
          </Link>
        </nav>
      </footer>
    </article>
  );
}