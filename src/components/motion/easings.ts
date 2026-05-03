export const easeOutExpo = [0.16, 1, 0.3, 1] as const

export const easeInOutQuart = [0.77, 0, 0.175, 1] as const

export const easeSpringSoft = {
  type: 'spring' as const,
  stiffness: 120,
  damping: 20,
  mass: 0.6,
}

export const motionDurations = {
  instant: 0,
  quick: 0.18,
  standard: 0.42,
  exit: 0.26,
  reveal: 0.7,
  drawer: 0.34,
  ripple: 0.6,
}
