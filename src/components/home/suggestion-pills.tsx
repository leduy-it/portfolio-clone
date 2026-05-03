'use client'

import { useLocale } from '@/lib/i18n'
import { SUGGESTIONS_BY_LOCALE } from '@/data/terminal-suggestions'

export const CHAT_SEND_EVENT = 'leduy:chat-send'

export function SuggestionPills() {
  const { locale, t } = useLocale()
  const suggestions = SUGGESTIONS_BY_LOCALE[locale] || SUGGESTIONS_BY_LOCALE.en

  function dispatch(question: string) {
    if (typeof window === 'undefined') return
    window.dispatchEvent(
      new CustomEvent(CHAT_SEND_EVENT, { detail: { text: question } })
    )
  }

  return (
    <div className="mt-5">
      <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-[rgb(var(--text-muted))]">
        {t('chat.suggestionsLabel') || 'Try'}
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => dispatch(s)}
            className="rounded-full border border-[rgb(var(--accent)/0.25)] bg-[rgb(var(--accent)/0.06)] px-3 py-1 font-mono text-[11px] text-[rgb(var(--text-secondary))] transition-all duration-200 ease-[var(--ease-out-quart)] hover:bg-[rgb(var(--accent)/0.14)] hover:border-[rgb(var(--accent)/0.55)] hover:text-[rgb(var(--accent))] active:scale-[0.97]"
          >
            &ldquo;{s}&rdquo;
          </button>
        ))}
      </div>
    </div>
  )
}
