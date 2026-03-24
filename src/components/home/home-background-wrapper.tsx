'use client'

import { useState, useSyncExternalStore } from 'react'
import { useTheme } from 'next-themes'
import { GameOfLifeBackground } from './game-of-life-background'

interface HomeBackgroundWrapperProps {
  active?: boolean
}

// Media query store for mobile detection
function createMediaQueryStore(query: string) {
  return {
    subscribe: (cb: () => void) => {
      const mql = window.matchMedia(query)
      if (mql.addEventListener) {
        mql.addEventListener('change', cb)
        return () => mql.removeEventListener('change', cb)
      } else {
        // Legacy Safari
        mql.addListener(cb)
        return () => mql.removeListener(cb)
      }
    },
    getSnapshot: () => window.matchMedia(query).matches,
    getServerSnapshot: () => false,
  }
}

const mobileStore = createMediaQueryStore('(max-width: 1023px)')

export function HomeBackgroundWrapper({ active = false }: HomeBackgroundWrapperProps) {
  const { resolvedTheme } = useTheme()
  const isMobile = useSyncExternalStore(
    mobileStore.subscribe,
    mobileStore.getSnapshot,
    mobileStore.getServerSnapshot
  )

  // Match original: dark = accent (#66fcf1), light = accent-hover (#0d9488)
  const color = resolvedTheme === 'dark' ? '#66fcf1' : '#0d9488'

  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
      <GameOfLifeBackground
        color={color}
        active={active}
        mobileLite={isMobile}
        pauseWhenHidden
      />
    </div>
  )
}
