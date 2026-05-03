'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

const ADMIN_FLAG_KEY = 'pf_admin_self'

function isAdminClient(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return window.localStorage.getItem(ADMIN_FLAG_KEY) === '1'
  } catch {
    return false
  }
}

export function VisitorTracker() {
  const pathname = usePathname()
  const lastSentRef = useRef<{ key: string; at: number } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return

    const search = window.location.search || ''
    const fullPath = pathname + search
    const now = Date.now()
    const last = lastSentRef.current
    if (last && last.key === fullPath && now - last.at < 1500) return
    lastSentRef.current = { key: fullPath, at: now }

    const headers: Record<string, string> = { 'content-type': 'application/json' }
    if (isAdminClient()) headers['x-admin-self'] = '1'

    const t = window.setTimeout(() => {
      fetch('/api/track', {
        method: 'POST',
        headers,
        keepalive: true,
        body: JSON.stringify({
          path: fullPath,
          referrer: typeof document !== 'undefined' ? document.referrer || null : null,
          screenWidth: window.innerWidth,
          screenHeight: window.innerHeight,
          locale: typeof navigator !== 'undefined' ? navigator.language || null : null,
          ts: new Date().toISOString(),
        }),
      }).catch(() => {
        /* swallow — analytics must never break the page */
      })
    }, 200)

    return () => window.clearTimeout(t)
  }, [pathname])

  return null
}

export function setAdminSelfFlag(on: boolean) {
  if (typeof window === 'undefined') return
  try {
    if (on) window.localStorage.setItem(ADMIN_FLAG_KEY, '1')
    else window.localStorage.removeItem(ADMIN_FLAG_KEY)
  } catch {
    /* ignore */
  }
}
