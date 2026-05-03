'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { I18N_STRINGS, type LocaleKey } from '@/data/i18n-strings'

export type Locale = 'en' | 'vi'

interface LocaleContextValue {
  locale: Locale
  setLocale: (next: Locale) => void
  t: (key: LocaleKey) => string
  isReady: boolean
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

const STORAGE_KEY = 'leduy.locale'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  // Default 'en' on first render (matches SSR output and first-paint).
  const [locale, setLocaleState] = useState<Locale>('en')
  const [isReady, setIsReady] = useState(false)

  // Hydrate from localStorage after mount.
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY)
      if (stored === 'en' || stored === 'vi') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLocaleState(stored)
      }
    } catch {
      /* ignore (private mode etc.) */
    }
    setIsReady(true)
  }, [])

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next)
    try {
      window.localStorage.setItem(STORAGE_KEY, next)
    } catch {
      /* ignore */
    }
    // Also update the <html lang="..."> attribute for accessibility / search.
    if (typeof document !== 'undefined') {
      document.documentElement.lang = next
    }
  }, [])

  const t = useCallback(
    (key: LocaleKey) => {
      const dict = I18N_STRINGS[locale] ?? I18N_STRINGS.en
      return dict[key] ?? I18N_STRINGS.en[key] ?? key
    },
    [locale]
  )

  const value = useMemo<LocaleContextValue>(
    () => ({ locale, setLocale, t, isReady }),
    [locale, setLocale, t, isReady]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext)
  if (!ctx) {
    // Tolerant fallback so server-only usage doesn't throw — returns English.
    return {
      locale: 'en',
      setLocale: () => {},
      t: (key: LocaleKey) => I18N_STRINGS.en[key] ?? key,
      isReady: false,
    }
  }
  return ctx
}

/**
 * Pick locale-aware text from an entry shaped like `{ field, field_vi }`.
 * Falls back to the English `field` if the `_vi` variant is missing.
 */
export function pickLocalized<T extends Record<string, unknown>>(
  entry: T,
  field: keyof T,
  locale: Locale
): string {
  if (locale === 'vi') {
    const viKey = `${String(field)}_vi` as keyof T
    const viValue = entry[viKey]
    if (typeof viValue === 'string' && viValue.trim().length > 0) {
      return viValue
    }
  }
  const value = entry[field]
  return typeof value === 'string' ? value : ''
}
