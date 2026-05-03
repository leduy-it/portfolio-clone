'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLocale } from '@/lib/i18n'
import { pickLocalized } from '@/lib/i18n'
import { PixelLogoFallback } from './experience-card'
import { ExperienceGallery, type ExperienceGalleryItem } from './experience-gallery'
import { InsightPanel } from './insight-panel'
import { ResourceCards, type ExperienceResourceLink } from './resource-cards'
import {
  ExperienceReveal,
  EASE_OUT_EXPO,
  EASE_OUT_QUART,
  SPRING_SOFT,
} from './experience-timeline-reveal'
import { PixelDivider } from '@/components/pixel-divider'

export interface CustomerItem {
  name: string
  region: string
  kind?: string
}

export interface MetricEntry {
  value: string
  label: string
  label_vi: string
  hint?: string
  hint_vi?: string
}

export interface ExperienceEntry {
  id: string
  slug: string
  title: string
  title_vi?: string
  company: string
  dates: string
  quote: string
  quote_vi?: string
  missions: string[]
  missions_vi?: string[]
  skills: string[]
  image: string
  logo: string | null
  checksum: string
  insight?: string
  insight_vi?: string
  gallery?: ExperienceGalleryItem[]
  links?: ExperienceResourceLink[]
  customers?: CustomerItem[]
  metrics?: MetricEntry[]
}

const CUSTOMER_KIND_LABEL: Record<string, string> = {
  bank: 'BANK',
  fintech: 'FINTECH',
  enterprise: 'ENTERPRISE',
  gov: 'GOVERNMENT',
}

// 14×14 inline SVG icons for customer kind
function IconBank() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1" y="6" width="12" height="1.2" rx="0.4" fill="currentColor" opacity="0.7" />
      <rect x="2.5" y="7.2" width="1.4" height="4" rx="0.3" fill="currentColor" opacity="0.7" />
      <rect x="6.3" y="7.2" width="1.4" height="4" rx="0.3" fill="currentColor" opacity="0.7" />
      <rect x="10.1" y="7.2" width="1.4" height="4" rx="0.3" fill="currentColor" opacity="0.7" />
      <rect x="1" y="11.2" width="12" height="1" rx="0.3" fill="currentColor" opacity="0.7" />
      <path d="M7 1.2L13 5.4H1L7 1.2Z" fill="currentColor" opacity="0.85" />
    </svg>
  )
}

function IconFintech() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1.5" y="4" width="11" height="7.5" rx="1.2" stroke="currentColor" strokeWidth="1.1" opacity="0.8" />
      <path d="M4.5 7.75h5M7 6v3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      <rect x="3" y="2.2" width="8" height="1.1" rx="0.4" fill="currentColor" opacity="0.55" />
    </svg>
  )
}

function IconEnterprise() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <rect x="1.5" y="4.5" width="11" height="8" rx="0.5" stroke="currentColor" strokeWidth="1.1" opacity="0.8" />
      <path d="M4.5 4.5V3a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.5" stroke="currentColor" strokeWidth="1.1" opacity="0.8" />
      <rect x="5.5" y="8" width="3" height="2.5" rx="0.3" fill="currentColor" opacity="0.65" />
      <path d="M1.5 8.5h11" stroke="currentColor" strokeWidth="0.9" opacity="0.4" />
    </svg>
  )
}

function IconGov() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true" className="shrink-0">
      <path d="M2 12.5h10M2.5 5.5h9v7H2.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" opacity="0.8" />
      <path d="M7 1.5L13 5H1L7 1.5Z" fill="currentColor" opacity="0.85" />
      <rect x="5.5" y="8.5" width="3" height="4" rx="0.3" fill="currentColor" opacity="0.65" />
    </svg>
  )
}

function KindIcon({ kind }: { kind?: string }) {
  switch (kind) {
    case 'bank': return <IconBank />
    case 'fintech': return <IconFintech />
    case 'gov': return <IconGov />
    default: return <IconEnterprise />
  }
}

interface Props {
  entry: ExperienceEntry
}

const MotionLink = motion.create(Link)

const heroItemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.58,
      ease: EASE_OUT_EXPO,
    },
  },
}

const missionListVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.08,
    },
  },
}

const missionItemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.48,
      ease: EASE_OUT_EXPO,
    },
  },
}

interface MagneticLinkProps {
  href: string
  className: string
  children: ReactNode
  direction?: 'left' | 'right'
}

function MagneticLink({
  href,
  className,
  children,
  direction = 'right',
}: MagneticLinkProps) {
  const shouldReduceMotion = useReducedMotion()
  const hoverX = direction === 'left' ? -4 : 4
  const tapX = direction === 'left' ? -2 : 2

  if (shouldReduceMotion) {
    return <Link href={href} className={className}>{children}</Link>
  }

  return (
    <MotionLink
      href={href}
      className={className}
      initial="rest"
      animate="rest"
      whileHover="hover"
      whileTap="tap"
      variants={{
        rest: { x: 0, scale: 1 },
        hover: {
          x: hoverX,
          scale: 1,
          transition: SPRING_SOFT,
        },
        tap: {
          x: tapX,
          scale: 0.96,
          transition: {
            duration: 0.18,
            ease: EASE_OUT_QUART,
          },
        },
      }}
      style={{ willChange: 'transform' }}
    >
      {children}
      <motion.span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left bg-current"
        variants={{
          rest: { scaleX: 0, opacity: 0.55 },
          hover: {
            scaleX: 1,
            opacity: 1,
            transition: {
              duration: 0.22,
              ease: EASE_OUT_QUART,
            },
          },
          tap: { scaleX: 1, opacity: 1 },
        }}
      />
    </MotionLink>
  )
}

// ── Main component ────────────────────────────────────────────────────────────

export function ExperienceDetailView({ entry }: Props) {
  const { locale, t } = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const title = pickLocalized(entry as unknown as Record<string, unknown>, 'title', locale)
  const quote = pickLocalized(entry as unknown as Record<string, unknown>, 'quote', locale)
  const missionsToShow = locale === 'vi' && entry.missions_vi ? entry.missions_vi : entry.missions
  const isWhatsNext = entry.slug === 'whats-next'

  const insight = entry.insight
    ? pickLocalized(entry as unknown as Record<string, unknown>, 'insight', locale)
    : null

  const heroImage = entry.image ? (
    <div className="relative h-32 w-32 overflow-hidden rounded-xl">
      <Image
        src={entry.image}
        alt={entry.company || title}
        fill
        className="object-contain"
        sizes="128px"
        priority
      />
    </div>
  ) : (
    <PixelLogoFallback entry={entry} size="detail" />
  )

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <MagneticLink
          href="/experience"
          direction="left"
          className="group relative mb-8 inline-flex items-center gap-2 pb-1 font-mono text-xs text-[color:var(--color-text-muted)] transition-colors hover:text-[color:var(--color-accent)] motion-reduce:transition-none"
        >
          <span aria-hidden>←</span>
          <span>{t('experience.cdBack')}</span>
        </MagneticLink>

        <div className="relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-8 sm:p-10">
          <span
            aria-hidden
            className="pointer-events-none absolute -right-2 -top-4 select-none font-mono text-7xl font-black text-[color:var(--color-accent)]/10 sm:text-8xl"
          >
            #{entry.id}
          </span>

          <div className="grid gap-8 md:grid-cols-[160px_1fr]">
            <div className="flex items-start justify-center">
              {shouldReduceMotion ? (
                heroImage
              ) : (
                <motion.div
                  initial={{ opacity: 0, filter: 'blur(6px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
                  style={{ willChange: 'opacity, filter' }}
                >
                  {heroImage}
                </motion.div>
              )}
            </div>

            <motion.div
              className="flex flex-col justify-center"
              initial={shouldReduceMotion ? undefined : 'hidden'}
              animate={shouldReduceMotion ? undefined : 'visible'}
              variants={
                shouldReduceMotion
                  ? undefined
                  : {
                      hidden: {},
                      visible: {
                        transition: {
                          staggerChildren: 0.06,
                          delayChildren: 0.04,
                        },
                      },
                    }
              }
            >
              {entry.dates && (
                <motion.p
                  className="mb-2 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]"
                  variants={shouldReduceMotion ? undefined : heroItemVariants}
                >
                  <span className="mr-2 text-[color:var(--color-accent)]">›</span>
                  {entry.dates}
                </motion.p>
              )}
              <motion.h1
                className="mb-2 font-mono text-3xl font-bold uppercase tracking-tight text-[color:var(--color-text-primary)] sm:text-4xl"
                style={{ textShadow: '3px 3px 0 rgb(var(--accent))' }}
                variants={shouldReduceMotion ? undefined : heroItemVariants}
              >
                {title}
              </motion.h1>
              <motion.p
                className="font-mono text-base font-semibold text-[color:var(--color-accent)]"
                variants={shouldReduceMotion ? undefined : heroItemVariants}
              >
                {entry.company}
              </motion.p>
            </motion.div>
          </div>

          {quote && (
            shouldReduceMotion ? (
              <blockquote className="mt-8 border-l-2 border-[color:var(--color-accent)] pl-4 font-mono text-sm italic leading-relaxed text-[color:var(--color-text-secondary)]">
                &ldquo;{quote}&rdquo;
              </blockquote>
            ) : (
              <motion.blockquote
                className="mt-8 border-l-2 border-[color:var(--color-accent)] pl-4 font-mono text-sm italic leading-relaxed text-[color:var(--color-text-secondary)]"
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.58, delay: 0.18, ease: EASE_OUT_EXPO }}
              >
                &ldquo;{quote}&rdquo;
              </motion.blockquote>
            )
          )}
        </div>

        <PixelDivider className="mt-6" />

        {entry.metrics && entry.metrics.length > 0 && (
          <section className="mt-10">
            <ExperienceReveal y={18} amount={0.45}>
              <h2 className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <span className="text-[color:var(--color-accent)]">##</span> Metrics
              </h2>
              <p className="mt-1 font-mono text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
                {locale === 'vi'
                  ? 'Những con số đằng sau công việc — đo trong production, không phải benchmark.'
                  : 'The numbers behind the work — measured in production, not in benchmarks.'}
              </p>
            </ExperienceReveal>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {entry.metrics.map((metric, idx) => {
                const isNegative = metric.value.startsWith('−') || metric.value.startsWith('-')
                const valueColor = isNegative
                  ? 'text-[rgb(var(--accent-warm))]'
                  : 'text-[rgb(var(--accent))]'
                const hintText = pickLocalized(metric as unknown as Record<string, unknown>, 'hint', locale)
                const labelText = pickLocalized(metric as unknown as Record<string, unknown>, 'label', locale)

                return (
                  <ExperienceReveal key={idx} y={12} amount={0.2} delay={idx * 0.04}>
                    <div className="rounded-2xl border border-[rgb(var(--border)/0.6)] bg-[rgb(var(--surface-card)/0.6)] p-5 backdrop-blur-md transition-all duration-200 ease-[var(--ease-out-quart)] hover:scale-[1.02] hover:border-[rgb(var(--accent)/0.5)] hover:shadow-[var(--shadow-elevated)] shadow-[var(--shadow-card)]">
                      <p className={`font-mono text-3xl font-semibold tabular-nums sm:text-4xl ${valueColor}`}>
                        {metric.value}
                      </p>
                      <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                        {labelText}
                      </p>
                      {hintText && (
                        <p className="mt-1 font-mono text-[11px] italic text-[color:var(--color-text-secondary)]">
                          {hintText}
                        </p>
                      )}
                    </div>
                  </ExperienceReveal>
                )
              })}
            </div>
          </section>
        )}

        {!isWhatsNext && missionsToShow.length > 0 && (
          <section className="mt-10">
            <ExperienceReveal y={18} amount={0.45}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <span className="text-[color:var(--color-accent)]">##</span> {t('experience.missions')}
              </h2>
            </ExperienceReveal>
            {shouldReduceMotion ? (
              <ol className="flex flex-col gap-3">
                {missionsToShow.map((mission, idx) => (
                  <li
                    key={idx}
                    className="flex gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-5 transition-colors hover:border-[color:var(--color-accent)]/60"
                  >
                    <span className="font-mono text-xs font-bold text-[color:var(--color-accent)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-mono text-sm leading-relaxed tabular-nums text-[color:var(--color-text-secondary)]">
                      {mission}
                    </p>
                  </li>
                ))}
              </ol>
            ) : (
              <motion.ol
                className="flex flex-col gap-3"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.18 }}
                variants={missionListVariants}
              >
                {missionsToShow.map((mission, idx) => (
                  <motion.li
                    key={idx}
                    className="flex gap-4 rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] p-5 transition-colors hover:border-[color:var(--color-accent)]/60"
                    variants={missionItemVariants}
                  >
                    <span className="font-mono text-xs font-bold text-[color:var(--color-accent)]">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <p className="font-mono text-sm leading-relaxed tabular-nums text-[color:var(--color-text-secondary)]">
                      {mission}
                    </p>
                  </motion.li>
                ))}
              </motion.ol>
            )}
          </section>
        )}

        {/* ── Delivered Network (achievement-class block) ──────────────────── */}
        {entry.customers && entry.customers.length > 0 && (
          <section className="mt-10">
            <ExperienceReveal y={18} amount={0.45}>
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                    <span className="text-[color:var(--color-accent)]">##</span>{' '}
                    Trusted by
                  </h2>
                  <p className="mt-1 max-w-md font-mono text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
                    {locale === 'vi'
                      ? 'Hệ thống production bàn giao cho khách hàng doanh nghiệp + chính phủ tại Việt Nam và Nhật Bản.'
                      : 'Production systems delivered to enterprise + government customers across Vietnam and Japan.'}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                  <span className="rounded-full border border-[color:var(--color-accent-warm)]/45 bg-[color:var(--color-accent-warm)]/10 px-2.5 py-1 text-[color:var(--color-accent-warm)]">
                    <span className="font-semibold">{entry.customers.length}</span>
                    <span className="ml-1.5 opacity-80">
                      {t('experience.deliveredCountLabel')}
                    </span>
                  </span>
                  {Array.from(
                    entry.customers.reduce<Map<string, number>>((acc, c) => {
                      acc.set(c.region, (acc.get(c.region) ?? 0) + 1)
                      return acc
                    }, new Map())
                  )
                    .sort((a, b) => b[1] - a[1])
                    .map(([region, n]) => (
                      <span
                        key={region}
                        className="rounded-full border border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)] px-2.5 py-1"
                      >
                        <span className="text-[color:var(--color-text-muted)]">{region}</span>
                        <span className="ml-1.5 text-[color:var(--color-text-primary)]">{n}</span>
                      </span>
                    ))}
                </div>
              </div>
            </ExperienceReveal>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {entry.customers.map((customer, idx) => {
                const isJP = customer.region === 'JP'
                const regionTone = isJP
                  ? 'border-[color:var(--color-accent-warm)]/45 bg-[color:var(--color-accent-warm)]/10 text-[color:var(--color-accent-warm)]'
                  : 'border-[color:var(--color-accent)]/45 bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)]'
                const kindLabel =
                  customer.kind && CUSTOMER_KIND_LABEL[customer.kind]
                    ? CUSTOMER_KIND_LABEL[customer.kind]
                    : customer.kind?.toUpperCase()

                const tile = (
                  <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] px-5 py-4 transition-[border-color,box-shadow,transform,background-color] duration-300 hover:-translate-y-0.5 hover:border-[color:var(--color-accent-warm)]/65 hover:bg-[color:var(--color-surface-overlay)] hover:shadow-[var(--shadow-card)] motion-reduce:transition-none motion-reduce:hover:translate-y-0">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-[color:var(--color-accent-warm)] opacity-70 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 motion-reduce:transition-none"
                    />
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)] text-[color:var(--color-text-secondary)] transition-colors duration-300 group-hover:border-[color:var(--color-accent-warm)]/50 group-hover:text-[color:var(--color-accent-warm)]">
                      <KindIcon kind={customer.kind} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[15px] font-semibold leading-tight text-[color:var(--color-text-primary)] transition-colors group-hover:text-[color:var(--color-accent-warm)]">
                        {customer.name}
                      </p>
                      <p className="mt-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[color:var(--color-text-muted)]">
                        {kindLabel ? <span>{kindLabel}</span> : null}
                        {kindLabel ? (
                          <span className="text-[color:var(--color-border-muted)]">·</span>
                        ) : null}
                        <span>C/{String(idx + 1).padStart(2, '0')}</span>
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-md border px-2 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em] ${regionTone}`}
                    >
                      {customer.region}
                    </span>
                  </div>
                )

                return (
                  <ExperienceReveal key={customer.name} y={12} amount={0.2} delay={idx * 0.025}>
                    {tile}
                  </ExperienceReveal>
                )
              })}
            </div>
          </section>
        )}

        {insight && <InsightPanel heading={t('experience.fieldNotes')} insight={insight} />}

        {entry.gallery && entry.gallery.length > 0 && (
          <ExperienceGallery
            heading={t('experience.gallery')}
            items={entry.gallery}
            locale={locale}
          />
        )}

        {entry.skills.length > 0 && (
          <section className="mt-10">
            <ExperienceReveal y={18} amount={0.45}>
              <h2 className="mb-4 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]">
                <span className="text-[color:var(--color-accent)]">##</span> {t('experience.stack')}
              </h2>
            </ExperienceReveal>
            <div className="flex flex-wrap gap-2">
              {entry.skills.map((skill) => (
                shouldReduceMotion ? (
                  <span
                    key={skill}
                    className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)] px-3 py-1 font-mono text-xs text-[color:var(--color-text-secondary)]"
                  >
                    {skill}
                  </span>
                ) : (
                  <motion.span
                    key={skill}
                    className="rounded border border-[color:var(--color-border)] bg-[color:var(--color-surface-overlay)] px-3 py-1 font-mono text-xs text-[color:var(--color-text-secondary)]"
                    whileHover={{ y: -4 }}
                    transition={SPRING_SOFT}
                    style={{ willChange: 'transform' }}
                  >
                    {skill}
                  </motion.span>
                )
              ))}
            </div>
          </section>
        )}

        {entry.links && entry.links.length > 0 && (
          <ResourceCards
            heading={t('experience.resources')}
            links={entry.links}
            locale={locale}
            visitLabel={t('experience.visit')}
            linkedInLabel={t('experience.viewOnLinkedIn')}
            officialLabel={t('experience.officialPage')}
          />
        )}

        <div className="mt-12 flex items-center justify-between font-mono text-xs text-[color:var(--color-text-muted)]">
          <MagneticLink
            href="/experience"
            direction="left"
            className="group relative inline-flex pb-1 transition-colors hover:text-[color:var(--color-accent)] motion-reduce:transition-none"
          >
            {t('experience.backToDex')}
          </MagneticLink>
          <span>{t('experience.checksum')}: {entry.checksum}</span>
        </div>
      </div>
    </main>
  )
}
