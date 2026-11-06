export interface PostFrontmatter {
  title: string;
  description: string;
  date: string;
  category: string;
  tags: string[];
  featured?: boolean;
  readingTime?: string;
  cover?: string;
  updated?: string;
}

export interface Post {
  slug: string;
  frontmatter: PostFrontmatter;
  content: string;
  htmlContent: string;
  headings: Heading[];
}

export interface Heading {
  level: number;
  text: string;
  id: string;
}
