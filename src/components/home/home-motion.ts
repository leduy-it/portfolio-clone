'use client'

import { useSyncExternalStore } from 'react'

function createMediaQueryStore(query: string) {
  return {
    subscribe: (callback: () => void) => {
      if (typeof window === 'undefined') {
        return () => undefined
      }

      const mediaQuery = window.matchMedia(query)

      if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', callback)
        return () => mediaQuery.removeEventListener('change', callback)
      }

      mediaQuery.addListener(callback)
      return () => mediaQuery.removeListener(callback)
    },
    getSnapshot: () => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false),
    getServerSnapshot: () => false,
  }
}

const reducedMotionStore = createMediaQueryStore('(prefers-reduced-motion: reduce)')
const coarsePointerStore = createMediaQueryStore('(pointer: coarse)')

export const APPLE_EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
export const APPLE_EASE_OUT_QUART = [0.25, 1, 0.5, 1] as const
export const SOFT_SPRING = {
  stiffness: 140,
  damping: 22,
  mass: 0.7,
} as const

export function useHomeMotionPreferences() {
  const prefersReducedMotion = useSyncExternalStore(
    reducedMotionStore.subscribe,
    reducedMotionStore.getSnapshot,
    reducedMotionStore.getServerSnapshot,
  )

  const isCoarsePointer = useSyncExternalStore(
    coarsePointerStore.subscribe,
    coarsePointerStore.getSnapshot,
    coarsePointerStore.getServerSnapshot,
  )

  return {
    prefersReducedMotion,
    isCoarsePointer,
  }
}
