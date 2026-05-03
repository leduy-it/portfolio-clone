'use client'

import { motion, useReducedMotion } from 'motion/react'
import BlogPostCard from '@/components/blog/blog-post-card'

interface BlogPost {
  title: string
  title_vi?: string
  slug: string
  date: string
  excerpt: string
  excerpt_vi?: string
  image?: string
  imageAlt?: string
  imageAlt_vi?: string
  tags?: string[]
  readingMinutes?: number
}

interface BlogListStaggerProps {
  posts: BlogPost[]
}

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const

export default function BlogListStagger({ posts }: BlogListStaggerProps) {
  const shouldReduceMotion = useReducedMotion()

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
      {posts.map((post, index) => (
        <motion.div
          key={post.slug}
          className="h-full"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={
            shouldReduceMotion
              ? undefined
              : { once: true, amount: 0.2, margin: '0px 0px -10% 0px' }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 0.52,
                  delay: index * 0.08,
                  ease: EASE_OUT_EXPO,
                }
          }
        >
          <BlogPostCard post={post} />
        </motion.div>
      ))}
    </div>
  )
}
