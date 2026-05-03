import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { BlogPostView } from '@/components/blog/blog-post-view'
import { buildMetadataOg } from '@/lib/og-meta'
import blogPosts from '@/data/blog-posts.json'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = blogPosts.find((p) => p.slug === slug)
  if (!post) return { title: 'Not found — leduy.py' }
  return buildMetadataOg({
    title: `${post.title} — leduy.py / research`,
    description: post.excerpt,
    route: 'blog-detail',
  })
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params

  const sortedPosts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  const postIndex = sortedPosts.findIndex((p) => p.slug === slug)
  if (postIndex === -1) notFound()

  const post = sortedPosts[postIndex]
  const prevPost = postIndex < sortedPosts.length - 1 ? sortedPosts[postIndex + 1] : null
  const nextPost = postIndex > 0 ? sortedPosts[postIndex - 1] : null

  return <BlogPostView post={post} prevPost={prevPost} nextPost={nextPost} />
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}
