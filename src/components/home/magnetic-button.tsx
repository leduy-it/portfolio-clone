'use client'

import type { PointerEventHandler, ReactNode } from 'react'
import { motion, useSpring, type HTMLMotionProps } from 'motion/react'
import { SOFT_SPRING, useHomeMotionPreferences } from './home-motion'

interface MagneticButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  children: ReactNode
  pull?: number
}

export function MagneticButton({
  children,
  className,
  onPointerLeave,
  onPointerMove,
  pull = 5,
  type = 'button',
  ...props
}: MagneticButtonProps) {
  const { isCoarsePointer, prefersReducedMotion } = useHomeMotionPreferences()
  const x = useSpring(0, SOFT_SPRING)
  const y = useSpring(0, SOFT_SPRING)
  const magneticDisabled = prefersReducedMotion || isCoarsePointer || props.disabled

  const handlePointerMove: PointerEventHandler<HTMLButtonElement> = (event) => {
    onPointerMove?.(event)
    if (magneticDisabled) return

    const rect = event.currentTarget.getBoundingClientRect()
    const offsetX = (event.clientX - rect.left) / rect.width - 0.5
    const offsetY = (event.clientY - rect.top) / rect.height - 0.5

    x.set(Math.max(-pull, Math.min(pull, offsetX * pull * 2)))
    y.set(Math.max(-pull, Math.min(pull, offsetY * pull * 2)))
  }

  const handlePointerLeave: PointerEventHandler<HTMLButtonElement> = (event) => {
    onPointerLeave?.(event)
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      {...props}
      type={type}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={magneticDisabled ? undefined : { x, y }}
      whileTap={magneticDisabled ? undefined : { scale: 0.96 }}
      transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', ...SOFT_SPRING }}
    >
      {children}
    </motion.button>
  )
}
