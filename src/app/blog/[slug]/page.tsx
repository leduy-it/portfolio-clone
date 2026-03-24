import Link from 'next/link'
import { notFound } from 'next/navigation'
import blogPosts from '@/data/blog-posts.json'

interface PageProps {
  params: Promise<{ slug: string }>
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function renderContent(content: string) {
  // Split by double newlines to form paragraphs
  return content.split('\n\n').map((paragraph, i) => (
    <p key={i}>{paragraph.trim()}</p>
  ))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-[rgb(var(--background))]">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-12 md:py-16">
        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-[rgb(var(--accent))] hover:text-[rgb(var(--accent-hover))] transition-colors duration-200 mb-8 group"
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            &larr;
          </span>
          <span>Back to posts</span>
        </Link>

        {/* Article */}
        <article>
          <h1 className="text-3xl font-bold text-white mb-3">{post.title}</h1>
          <p className="text-sm text-[rgb(var(--text-muted))] mb-8">
            {formatDate(post.date)}
          </p>
          <div className="prose prose-invert prose-lg max-w-none prose-p:text-[rgb(var(--text-secondary))] prose-p:leading-relaxed">
            {renderContent(post.content)}
          </div>
        </article>
      </div>
    </main>
  )
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}
