import Link from 'next/link'

interface BlogPost {
  title: string
  slug: string
  date: string
  excerpt: string
}

interface BlogPostCardProps {
  post: BlogPost
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <article className="py-8 border-b border-[rgb(var(--border))] last:border-b-0">
      <Link href={`/blog/${post.slug}`} className="group block">
        <h3 className="text-xl font-semibold text-[rgb(var(--accent))] mb-2 hover:text-[rgb(var(--accent-hover))] transition-colors duration-200">
          {post.title}
        </h3>
      </Link>
      <p className="text-sm text-[rgb(var(--text-muted))] mb-3">
        {formatDate(post.date)}
      </p>
      <p className="text-sm text-[rgb(var(--text-secondary))] mb-4 leading-relaxed">
        {post.excerpt}
      </p>
      <Link
        href={`/blog/${post.slug}`}
        className="inline-flex items-center gap-1 text-sm text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] transition-colors duration-200 group/link"
      >
        <span>Read more</span>
        <span className="transition-transform duration-200 group-hover/link:translate-x-1">
          &rarr;
        </span>
      </Link>
    </article>
  )
}
