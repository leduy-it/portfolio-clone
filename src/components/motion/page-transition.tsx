'use client'

import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { usePathname } from 'next/navigation'
import { type PropsWithChildren } from 'react'
import { easeInOutQuart, easeOutExpo, motionDurations } from './easings'

export function PageTransition({ children }: PropsWithChildren) {
  const pathname = usePathname()
  const reducedMotion = useReducedMotion()

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        key={pathname}
        initial={reducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            duration: reducedMotion ? motionDurations.instant : motionDurations.standard,
            ease: easeOutExpo,
          },
        }}
        exit={
          reducedMotion
            ? { opacity: 1, y: 0 }
            : {
                opacity: 0,
                y: -6,
                transition: {
                  duration: motionDurations.exit,
                  ease: easeInOutQuart,
                },
              }
        }
        style={{ willChange: reducedMotion ? 'auto' : 'transform, opacity' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
