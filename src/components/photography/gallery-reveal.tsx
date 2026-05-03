'use client'

import type { HTMLMotionProps, Transition } from 'motion/react'
import { motion, useInView, useReducedMotion } from 'motion/react'
import { type ReactNode, useRef } from 'react'

export const APPLE_EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const APPLE_EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const
export const SOFT_SPRING: Transition = {
  type: 'spring',
  stiffness: 140,
  damping: 22,
}
const REVEAL_MARGIN = '0px 0px -10% 0px' as const

interface GalleryRevealProps extends Omit<HTMLMotionProps<'div'>, 'children'> {
  amount?: number | 'some' | 'all'
  children: ReactNode
  delay?: number
  duration?: number
  once?: boolean
  y?: number
}

export function GalleryReveal({
  amount = 0.2,
  animate,
  children,
  delay = 0,
  duration = 0.56,
  initial,
  once = true,
  transition,
  y = 18,
  ...rest
}: GalleryRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null)
  const prefersReducedMotion = useReducedMotion()
  const isInView = useInView(ref, { amount, margin: REVEAL_MARGIN, once })
  const isRevealed = prefersReducedMotion || isInView

  return (
    <motion.div
      ref={ref}
      animate={animate ?? (isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y })}
      initial={initial ?? (prefersReducedMotion ? false : { opacity: 0, y })}
      transition={
        transition ?? {
          duration: prefersReducedMotion ? 0 : duration,
          ease: APPLE_EASE_OUT_EXPO,
          delay: prefersReducedMotion ? 0 : delay,
        }
      }
      {...rest}
    >
      {children}
    </motion.div>
  )
}
