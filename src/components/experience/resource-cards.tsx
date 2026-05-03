'use client'

import Image from 'next/image'
import type { MouseEvent } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Magnetic } from '@/components/motion'
import { pickLocalized, type Locale } from '@/lib/i18n'
import { EASE_OUT_QUART } from './experience-timeline-reveal'
import { LinkFavicon, type ExperienceLinkKind } from './link-favicon'

export interface ExperienceResourceLink {
  label: string
  label_vi?: string
  url: string
  kind: ExperienceLinkKind
  preview?: string
}

interface ResourceCardsProps {
  heading: string
  links: ExperienceResourceLink[]
  locale: Locale
  visitLabel: string
  linkedInLabel: string
  officialLabel: string
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => { finished: Promise<void> }
}

function getHost(url: string) {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function getActionLabel(
  kind: ExperienceLinkKind,
  visitLabel: string,
  linkedInLabel: string,
  officialLabel: string
) {
  if (kind === 'linkedin') {
    return linkedInLabel
  }
  if (kind === 'official') {
    return officialLabel
  }
  return visitLabel
}

function handleViewTransition(event: MouseEvent<HTMLAnchorElement>, href: string) {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.altKey ||
    event.ctrlKey ||
    event.shiftKey ||
    typeof window === 'undefined'
  ) {
    return
  }

  let url: URL
  try {
    url = new URL(href, window.location.href)
  } catch {
    return
  }

  if (url.origin !== window.location.origin) {
    return
  }

  const startViewTransition = (document as ViewTransitionDocument).startViewTransition
  if (!startViewTransition) {
    return
  }

  event.preventDefault()
  const transition = startViewTransition(() => {
    window.open(url.href, '_blank', 'noopener,noreferrer')
  })
  void transition.finished
}

export function ResourceCards({
  heading,
  links,
  locale,
  visitLabel,
  linkedInLabel,
  officialLabel,
}: ResourceCardsProps) {
  const shouldReduceMotion = useReducedMotion()
  const reducedMotion = shouldReduceMotion === true

  if (links.length === 0) {
    return null
  }

  return (
    <section className="mt-10" aria-labelledby="experience-resources-heading">
      <h2
        id="experience-resources-heading"
        className="mb-4 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]"
      >
        <span className="text-[color:var(--color-accent)]">##</span> {heading}
      </h2>
      <div className="grid gap-3 md:grid-cols-2">
        {links.map((link) => {
          const label = pickLocalized(link as unknown as Record<string, unknown>, 'label', locale)
          const host = getHost(link.url)
          const actionLabel = getActionLabel(
            link.kind,
            visitLabel,
            linkedInLabel,
            officialLabel
          )

          return (
            <Magnetic key={link.url} className="h-full w-full" disabled={reducedMotion} strength={4}>
              <motion.a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer external"
                aria-label={`${label} (opens in new tab)`}
                className="group flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-3 transition-[background-color,border-color,box-shadow,transform] duration-200 ease-[var(--ease-out-quart)] hover:border-[color:var(--color-accent)]/65 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--color-accent)] motion-reduce:transition-none sm:p-4"
                style={{ boxShadow: 'var(--shadow-card)', willChange: reducedMotion ? undefined : 'transform' }}
                whileHover={
                  reducedMotion
                    ? undefined
                    : { y: -2, boxShadow: 'var(--shadow-elevated)' }
                }
                whileTap={reducedMotion ? undefined : { scale: 0.985 }}
                transition={{ duration: 0.2, ease: EASE_OUT_QUART }}
                onClick={(event) => handleViewTransition(event, link.url)}
              >
                {link.preview && (
                  <div
                    aria-hidden="true"
                    className="relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-[color:var(--color-border-muted)] bg-[color:var(--color-surface-overlay)]"
                  >
                    <Image
                      src={link.preview}
                      alt=""
                      fill
                      sizes="(min-width: 768px) 420px, 100vw"
                      className="object-cover opacity-90 transition-[opacity,transform] duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.02] group-hover:opacity-100 motion-reduce:transition-none"
                      unoptimized
                    />
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[color:var(--color-surface-card)]/70 to-transparent"
                    />
                  </div>
                )}
                <span className="flex items-center gap-3">
                  <LinkFavicon kind={link.kind} host={host} />
                  <span className="min-w-0 flex-1">
                    <span className="mb-1 flex items-center gap-2">
                      <span className="truncate font-mono text-sm font-semibold text-[color:var(--color-text-primary)]">
                        {label}
                      </span>
                      {link.kind === 'linkedin' && (
                        <span className="rounded-full border border-[#0A66C2]/45 bg-[#0A66C2]/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#0A66C2]">
                          Honor
                        </span>
                      )}
                    </span>
                    <span className="block truncate font-mono text-[11px] text-[color:var(--color-text-muted)]">
                      {host}
                    </span>
                  </span>
                  <span
                    className={[
                      'shrink-0 inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-right font-mono text-[10px] font-semibold uppercase tracking-widest transition-colors duration-200',
                      link.kind === 'linkedin'
                        ? 'border-[#0A66C2]/40 text-[#0A66C2] group-hover:border-[#0A66C2] group-hover:bg-[#0A66C2]/10'
                        : 'border-[color:var(--color-border)] text-[color:var(--color-text-muted)] group-hover:border-[color:var(--color-accent)]/55 group-hover:text-[color:var(--color-accent)]',
                    ].join(' ')}
                  >
                    {actionLabel}
                    <span aria-hidden="true">↗</span>
                  </span>
                </span>
              </motion.a>
            </Magnetic>
          )
        })}
      </div>
    </section>
  )
}
