'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

export const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const
export const SPRING_SOFT = {
  type: 'spring',
  stiffness: 140,
  damping: 22,
} as const

interface ExperienceRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  x?: number
  y?: number
  duration?: number
  amount?: number
}

export function ExperienceReveal({
  children,
  className,
  delay = 0,
  x = 0,
  y = 16,
  duration = 0.58,
  amount = 0.25,
}: ExperienceRevealProps) {
  const shouldReduceMotion = useReducedMotion()

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  )
}

interface ExperienceTimelineRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: 'left' | 'right'
}

export function ExperienceTimelineReveal({
  children,
  className,
  delay = 0,
  direction = 'left',
}: ExperienceTimelineRevealProps) {
  return (
    <ExperienceReveal
      className={className}
      delay={delay}
      x={direction === 'right' ? 12 : -12}
      y={0}
      duration={0.58}
      amount={0.18}
    >
      {children}
    </ExperienceReveal>
  )
}
