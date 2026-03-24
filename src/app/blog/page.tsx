import blogPosts from '@/data/blog-posts.json'
import BlogPostCard from '@/components/blog/blog-post-card'

export default function BlogPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  return (
    <main className="min-h-screen bg-[rgb(var(--background))]">
      <div className="max-w-3xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="text-3xl font-extrabold text-white mb-10">
          Life Through My Lens
        </h1>
        <div>
          {posts.map((post) => (
            <BlogPostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </main>
  )
}
