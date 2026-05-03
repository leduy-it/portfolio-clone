'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { EASE_OUT_EXPO } from './experience-timeline-reveal'

interface InsightPanelProps {
  heading: string
  insight: string
}

export function InsightPanel({ heading, insight }: InsightPanelProps) {
  const ref = useRef<HTMLElement | null>(null)
  const shouldReduceMotion = useReducedMotion()
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    if (shouldReduceMotion) return
    const node = ref.current
    if (!node) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    )
    io.observe(node)
    return () => io.disconnect()
  }, [shouldReduceMotion])

  return (
    <motion.section
      ref={ref}
      aria-labelledby="experience-field-notes"
      className="relative mt-10"
      initial={false}
      animate={shouldReduceMotion || revealed ? { opacity: 1, y: 0 } : { opacity: 1, y: 6 }}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      style={{ willChange: shouldReduceMotion ? undefined : 'transform' }}
    >
      <div
        className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] px-6 py-7 sm:px-8 sm:py-9"
        style={{ boxShadow: 'var(--shadow-card)' }}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-16 -top-32 h-72"
          style={{
            background:
              'radial-gradient(ellipse at center, rgb(var(--accent) / 0.08), transparent 68%)',
          }}
        />
        <div className="relative">
          <h2
            id="experience-field-notes"
            className="mb-6 font-mono text-xs uppercase tracking-widest text-[color:var(--color-accent)]"
          >
            {heading}
          </h2>
          <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:gap-6">
            <span
              aria-hidden="true"
              className="font-mono text-5xl leading-none text-[color:var(--color-accent)] sm:pt-1"
            >
              &rsaquo;
            </span>
            <blockquote className="max-w-[64ch] border-l-2 border-[color:var(--color-accent)]/60 pl-5 sm:pl-6">
              <p className="font-mono text-[15px] font-normal leading-[1.85] text-[color:var(--color-text-primary)]/95 sm:text-[17px] sm:leading-[1.8]">
                {insight}
              </p>
            </blockquote>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
