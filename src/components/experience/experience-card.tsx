'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { useLocale } from '@/lib/i18n'
import { pickLocalized } from '@/lib/i18n'
import { EASE_OUT_EXPO, EASE_OUT_QUART, SPRING_SOFT } from './experience-timeline-reveal'

interface ExperienceEntry {
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
}

interface ExperienceCardProps {
  entry: ExperienceEntry
  featured?: boolean
  variant?: CompactCardVariant
  sectionNumber?: string
}

type PixelLogoSize = 'featured' | 'compact' | 'detail'
type CompactCardVariant = 'wide' | 'narrow'
type ExperienceKind = 'work' | 'award' | 'upcoming'

const MotionLink = motion.create(Link)

const cardVariants = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -3,
    scale: 1.008,
    transition: SPRING_SOFT,
  },
  tap: {
    y: -1,
    scale: 0.99,
    transition: {
      duration: 0.18,
      ease: EASE_OUT_QUART,
    },
  },
}

const logoVariants = {
  rest: {
    scale: 1,
    filter: 'brightness(1)',
  },
  hover: {
    scale: 1.04,
    filter: 'brightness(1.03)',
    transition: {
      duration: 0.5,
      ease: EASE_OUT_EXPO,
    },
  },
}

const logoFrameConfig: Record<
  PixelLogoSize,
  {
    frame: string
    inner: string
    imagePadding: string
    imageSizes: string
  }
> = {
  featured: {
    frame: 'h-52 w-52 rounded-[28px]',
    inner: 'rounded-[27px]',
    imagePadding: 'p-6',
    imageSizes: '208px',
  },
  compact: {
    frame: 'h-36 w-36 rounded-[22px]',
    inner: 'rounded-[21px]',
    imagePadding: 'p-3',
    imageSizes: '144px',
  },
  detail: {
    frame: 'h-40 w-40 rounded-[24px]',
    inner: 'rounded-[23px]',
    imagePadding: 'p-5',
    imageSizes: '160px',
  },
}

const cardTransitionStyle = {
  transitionTimingFunction: 'var(--ease-out-expo)',
} as const

export function ExperienceCard({
  entry,
  featured = false,
  variant = 'narrow',
  sectionNumber,
}: ExperienceCardProps) {
  const isWhatsNext = entry.slug === 'whats-next'

  if (isWhatsNext) {
    return <WhatsNextCard entry={entry} />
  }

  if (featured) {
    return <FeaturedCard entry={entry} />
  }

  return (
    <CompactCard
      entry={entry}
      variant={variant}
      sectionNumber={sectionNumber}
    />
  )
}

const AWARD_SLUGS = new Set(['soict-hackathon', 'hcmc-dost-award'])

function getExperienceKind(slug: string): ExperienceKind {
  if (slug === 'whats-next') return 'upcoming'
  if (AWARD_SLUGS.has(slug)) return 'award'
  return 'work'
}

function isWarmKind(kind: ExperienceKind) {
  return kind === 'award' || kind === 'upcoming'
}

function getAccentRgbToken(kind: ExperienceKind) {
  return isWarmKind(kind) ? 'var(--accent-warm)' : 'var(--accent)'
}

function getKindLabel(kind: ExperienceKind) {
  if (kind === 'award') return 'AWARD'
  if (kind === 'upcoming') return 'OPEN SLOT'
  return 'WORK'
}

function KindBadge({ kind, compact = false }: { kind: ExperienceKind; compact?: boolean }) {
  const badgeClass = isWarmKind(kind)
    ? 'border-[rgb(var(--accent-warm)/0.6)] bg-[rgb(var(--accent-warm)/0.12)] text-[rgb(var(--accent-warm))]'
    : 'border-[rgb(var(--accent)/0.58)] bg-[rgb(var(--accent)/0.1)] text-[rgb(var(--accent))]'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-mono font-semibold uppercase ${compact ? 'px-2 py-0.5 text-[9px] tracking-[0.18em]' : 'px-2.5 py-1 text-[10px] tracking-[0.22em]'} ${badgeClass}`}
    >
      {kind === 'award' ? <span aria-hidden="true">▲</span> : null}
      {getKindLabel(kind)}
    </span>
  )
}

function EditorialTagRow({
  kind,
  dates,
  id,
  compact = false,
}: {
  kind: ExperienceKind
  dates?: string
  id: string
  compact?: boolean
}) {
  return (
    <div
      className={`relative z-10 flex flex-wrap items-center gap-2 font-mono uppercase text-[rgb(var(--text-muted))] ${compact ? 'text-[10px] tracking-[0.18em]' : 'text-[11px] tracking-[0.22em]'}`}
    >
      <KindBadge kind={kind} compact={compact} />
      {dates ? (
        <>
          <span className="text-[rgb(var(--border-muted))]">·</span>
          <span>{dates}</span>
        </>
      ) : null}
      <span className="text-[rgb(var(--border-muted))]">·</span>
      <span>#{id}</span>
    </div>
  )
}

function SectionNumber({ value }: { value: string }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-5 top-5 z-0 font-mono text-6xl font-semibold leading-none tracking-normal text-[rgb(var(--border-muted)/0.2)] sm:text-7xl"
    >
      {value}
    </span>
  )
}

function HoverSideRail({ kind }: { kind: ExperienceKind }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-20 h-full w-1 origin-top scale-y-0 rounded-r-full transition-transform duration-[380ms] group-hover:scale-y-100 motion-reduce:transition-none"
      style={{
        ...cardTransitionStyle,
        backgroundColor: `rgb(${getAccentRgbToken(kind)})`,
      }}
    />
  )
}

function AccentHalo({ kind }: { kind: ExperienceKind }) {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute -right-14 -top-14 z-0 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
      style={{
        ...cardTransitionStyle,
        backgroundColor: `rgb(${getAccentRgbToken(kind)} / 0.14)`,
      }}
    />
  )
}

function trimMission(mission: string, maxLength: number) {
  if (mission.length <= maxLength) return mission
  return `${mission.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`
}

function getFallbackCharacter(entry: ExperienceEntry) {
  const source = (entry.company || entry.title || '?').trim()
  const match = source.match(/[A-Za-z0-9?]/)
  return (match?.[0] ?? '?').toUpperCase()
}

function buildPixelMask(seedChar: string) {
  const cells: boolean[] = []
  let state = seedChar.charCodeAt(0) || 63

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 4; col += 1) {
      state = (state * 1664525 + 1013904223 + row * 17 + col * 31) >>> 0
      cells.push(state % 10 < 4)
    }
  }

  if (!cells.some(Boolean)) {
    cells[10] = true
  }

  return cells
}

function LogoFrameShell({
  size,
  children,
}: {
  size: PixelLogoSize
  children: ReactNode
}) {
  const config = logoFrameConfig[size]

  return (
    <div
      className={`relative flex ${config.frame} items-center justify-center overflow-hidden border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.72)]`}
      style={{ boxShadow: 'inset 0 1px 0 rgb(var(--foreground) / 0.06)' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(var(--border) / 0.45) 1px, transparent 1px), linear-gradient(rgb(var(--border) / 0.45) 1px, transparent 1px)',
          backgroundSize: '8px 8px',
        }}
      />
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute inset-[1px] border border-[rgb(var(--border-muted)/0.42)] ${config.inner}`}
      />
      {children}
    </div>
  )
}

function PixelLogoMark({ entry }: { entry: ExperienceEntry }) {
  const cells = buildPixelMask(getFallbackCharacter(entry))

  return (
    <svg
      viewBox="0 0 64 64"
      className="relative h-4/5 w-4/5"
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {Array.from({ length: 8 }, (_, row) =>
        Array.from({ length: 8 }, (_, col) => {
          const mirroredCol = col < 4 ? col : 7 - col
          const isOn = cells[row * 4 + mirroredCol]

          return isOn ? (
            <rect
              key={`${row}-${col}`}
              x={col * 8}
              y={row * 8}
              width="8"
              height="8"
              fill="rgb(var(--accent))"
              shapeRendering="crispEdges"
            />
          ) : null
        })
      )}
    </svg>
  )
}

export function PixelLogoFallback({
  entry,
  size,
}: {
  entry: ExperienceEntry
  size: PixelLogoSize
}) {
  return (
    <LogoFrameShell size={size}>
      <PixelLogoMark entry={entry} />
    </LogoFrameShell>
  )
}

function ExperienceLogo({
  entry,
  title,
  size,
}: {
  entry: ExperienceEntry
  title: string
  size: PixelLogoSize
}) {
  const config = logoFrameConfig[size]

  if (!entry.image) {
    return <PixelLogoFallback entry={entry} size={size} />
  }

  return (
    <LogoFrameShell size={size}>
      <div className="relative h-full w-full">
        <Image
          src={entry.image}
          alt={title}
          fill
          unoptimized
          className={`object-contain ${config.imagePadding}`}
          sizes={config.imageSizes}
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </LogoFrameShell>
  )
}

function HoverUnderline() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-[rgb(var(--accent))] opacity-80 transition-[transform,opacity] duration-500 group-hover:scale-x-100 group-hover:opacity-100 motion-reduce:transition-none"
      style={cardTransitionStyle}
    />
  )
}

function CornerCrosshairs({ kind = 'work' }: { kind?: ExperienceKind }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => {
        const base =
          'absolute h-3 w-3 transition-[opacity,transform] duration-500 motion-reduce:transition-none opacity-40 group-hover:opacity-100'
        const positions: Record<typeof corner, string> = {
          'top-left': 'left-3 top-3',
          'top-right': 'right-3 top-3',
          'bottom-left': 'left-3 bottom-3',
          'bottom-right': 'right-3 bottom-3',
        }
        const borders: Record<typeof corner, string> = {
          'top-left': 'border-l border-t',
          'top-right': 'border-r border-t',
          'bottom-left': 'border-l border-b',
          'bottom-right': 'border-r border-b',
        }
        return (
          <span
            key={corner}
            className={`${base} ${positions[corner]} ${borders[corner]} group-hover:scale-110`}
            style={{
              ...cardTransitionStyle,
              borderColor: `rgb(${getAccentRgbToken(kind)} / 0.85)`,
            }}
          />
        )
      })}
    </div>
  )
}

function OpenLogCta({
  label,
  slug,
  reduceMotion,
  kind = 'work',
  size = 'default',
}: {
  label: string
  slug: string
  reduceMotion: boolean
  kind?: ExperienceKind
  size?: 'default' | 'compact'
}) {
  const accentClass = isWarmKind(kind)
    ? 'border-[rgb(var(--accent-warm)/0.5)] bg-[rgb(var(--accent-warm)/0.08)] text-[rgb(var(--accent-warm))] group-hover:border-[rgb(var(--accent-warm))] group-hover:bg-[rgb(var(--accent-warm)/0.14)] group-hover:shadow-[0_8px_24px_-12px_rgb(var(--accent-warm)/0.65)]'
    : 'border-[rgb(var(--accent)/0.5)] bg-[rgb(var(--accent)/0.06)] text-[rgb(var(--accent))] group-hover:border-[rgb(var(--accent))] group-hover:bg-[rgb(var(--accent)/0.14)] group-hover:shadow-[0_8px_24px_-12px_rgb(var(--accent)/0.65)]'
  const sizeClass =
    size === 'compact'
      ? 'gap-1.5 px-2.5 py-1 text-[10px] tracking-[0.18em]'
      : 'gap-2 px-3 py-1.5 text-[11px] tracking-[0.22em]'

  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex items-center self-start rounded-md border font-mono uppercase shadow-[inset_0_-1px_0_rgb(var(--foreground)/0.08)] transition-[border-color,background-color,box-shadow,color] duration-300 motion-reduce:transition-none ${accentClass} ${sizeClass}`}
      style={cardTransitionStyle}
    >
      <span>{label}</span>
      <span className="text-[rgb(var(--text-muted))]">/{slug}</span>
      <motion.span
        className={isWarmKind(kind) ? 'text-[rgb(var(--accent-warm))]' : 'text-[rgb(var(--accent))]'}
        animate={
          reduceMotion
            ? undefined
            : {
                x: [0, 2, 0, 2, 0],
                y: [0, -1, 0, -1, 0],
                opacity: [1, 1, 0.7, 1, 1],
              }
        }
        transition={
          reduceMotion
            ? undefined
            : {
                duration: 2.4,
                repeat: Infinity,
                repeatDelay: 2.6,
                ease: EASE_OUT_QUART,
              }
        }
      >
        ↗
      </motion.span>
    </span>
  )
}

const METRIC_PATTERNS: RegExp[] = [
  /\d+%\s*(?:→|->|–|—|-)\s*\d+%/g,
  /~?\d+%\s*(?:lower|less|reduced|cut|reduction|improvement|increase|boost|gain|faster|cheaper|higher|fewer|more)/gi,
  /(?:from\s+)?\d+%\s+to\s+\d+%/gi,
  /\d{1,3}(?:,\d{3})*[km]?\+?\s*(?:questions|customers|users|requests|hours|docs|images|datasets|labels|tokens|jobs|merchants|banks|countries|conversions|deployments|samples)/gi,
  /\d+x\s*(?:faster|throughput|cheaper|higher|lower|better)/gi,
  /\$\d+(?:\.\d+)?[kmb]?\+?/gi,
  /~?\d+\.\d+%/g,
]

function extractAchievements(missions: string[], maxN = 3): string[] {
  const out: string[] = []
  const seen = new Set<string>()
  for (const m of missions) {
    for (const re of METRIC_PATTERNS) {
      const matches = m.match(re)
      if (!matches) continue
      for (const match of matches) {
        const norm = match.replace(/\s+/g, ' ').trim()
        const key = norm.toLowerCase()
        if (seen.has(key)) continue
        seen.add(key)
        out.push(norm)
        if (out.length >= maxN) return out
      }
    }
  }
  return out
}

function AchievementsRow({ items, dense = false }: { items: string[]; dense?: boolean }) {
  if (items.length === 0) return null
  return (
    <div
      className={`flex flex-wrap items-center gap-2 ${dense ? 'mt-3' : 'mt-5'}`}
      aria-label="key impact metrics"
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.3em] text-[rgb(var(--text-muted))]">
        impact
      </span>
      <span className="text-[rgb(var(--border-muted))]">/</span>
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className="group/achv relative inline-flex items-center gap-1.5 rounded-md border border-[rgb(var(--accent-warm)/0.55)] bg-[rgb(var(--accent-warm)/0.1)] px-2.5 py-1 font-mono text-[11px] font-semibold tracking-tight text-[rgb(var(--accent-warm))] shadow-[inset_0_-1px_0_rgb(var(--accent-warm)/0.25)] transition-[transform,box-shadow,background-color] duration-300 hover:bg-[rgb(var(--accent-warm)/0.18)] hover:shadow-[0_6px_20px_-10px_rgb(var(--accent-warm)/0.6)] motion-reduce:transition-none"
        >
          <span className="text-[10px]">▲</span>
          <span>{item}</span>
        </span>
      ))}
    </div>
  )
}

function FeaturedCard({ entry }: { entry: ExperienceEntry }) {
  const { locale, t } = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const title = pickLocalized(entry as unknown as Record<string, unknown>, 'title', locale)
  const missionsToShow = locale === 'vi' && entry.missions_vi ? entry.missions_vi : entry.missions

  return (
    <MotionLink
      href={`/experience/${entry.slug}`}
      aria-label={`View experience entry ${entry.id} — ${title} at ${entry.company}`}
      className="group relative block overflow-hidden rounded-[30px] border border-[rgb(var(--border))] bg-[rgb(var(--surface-card))] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-500 hover:border-[rgb(var(--accent)/0.85)] hover:shadow-[var(--shadow-elevated)] hover:ring-1 hover:ring-[rgb(var(--accent)/0.55)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface-page))] motion-reduce:transition-none"
      initial={shouldReduceMotion ? undefined : 'rest'}
      animate={shouldReduceMotion ? undefined : 'rest'}
      whileHover={shouldReduceMotion ? undefined : 'hover'}
      whileTap={shouldReduceMotion ? undefined : 'tap'}
      variants={shouldReduceMotion ? undefined : cardVariants}
      style={{ ...cardTransitionStyle, willChange: shouldReduceMotion ? undefined : 'transform' }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          ...cardTransitionStyle,
          backgroundImage:
            'radial-gradient(circle at top right, rgb(var(--accent) / 0.12), transparent 34%), radial-gradient(circle at bottom left, rgb(var(--accent-warm) / 0.08), transparent 30%)',
        }}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--accent)/0.9),transparent)] opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none" style={cardTransitionStyle} />

      <div className="relative border-b border-[rgb(var(--border)/0.85)] px-6 py-4 font-mono text-[11px] uppercase tracking-[0.28em] text-[rgb(var(--text-muted))] sm:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.72)] px-2.5 py-1 text-[rgb(var(--accent))]">
              featured log
            </span>
            <span>/{entry.slug}</span>
          </div>
          <span className="text-[rgb(var(--accent))]">#{entry.id}</span>
        </div>
      </div>

      <div className="relative grid gap-0 lg:grid-cols-[260px_minmax(0,1fr)]">
        <div className="flex items-center justify-center border-b border-[rgb(var(--border)/0.85)] px-6 py-8 lg:border-b-0 lg:border-r lg:px-10 lg:py-10">
          {shouldReduceMotion ? (
            <ExperienceLogo entry={entry} title={title} size="featured" />
          ) : (
            <motion.div
              variants={logoVariants}
              style={{ willChange: 'transform, filter' }}
            >
              <ExperienceLogo entry={entry} title={title} size="featured" />
            </motion.div>
          )}
        </div>

        <div className="flex flex-col px-6 py-7 sm:px-8 sm:py-8">
          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[rgb(var(--text-muted))]">
            {entry.dates ? <span>{entry.dates}</span> : null}
            <span className="text-[rgb(var(--border-muted))]">·</span>
            <span className="text-[rgb(var(--accent))]">{entry.company}</span>
          </div>

          <div className="relative mt-5 inline-block pb-3">
            <h2 className="max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))] transition-colors duration-300 group-hover:text-[rgb(var(--text-primary))] sm:text-[2.15rem]">
              {title}
            </h2>
            <HoverUnderline />
          </div>

          {missionsToShow.length > 0 ? (
            <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-[rgb(var(--text-secondary))]">
              {missionsToShow[0]}
            </p>
          ) : null}

          <AchievementsRow items={extractAchievements(entry.missions, 3)} />

          {entry.skills.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2.5">
              {entry.skills.slice(0, 5).map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.72)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[rgb(var(--text-secondary))]"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[rgb(var(--text-muted))]">
            <span className="rounded-full border border-[rgb(var(--border))] px-2.5 py-1">
              {missionsToShow.length.toString().padStart(2, '0')} missions
            </span>
            <span className="rounded-full border border-[rgb(var(--border))] px-2.5 py-1">
              {entry.checksum}
            </span>
          </div>

          <div className="mt-8">
            <OpenLogCta
              label={t('experience.viewLink') || 'open log'}
              slug={entry.slug}
              reduceMotion={!!shouldReduceMotion}
            />
          </div>
        </div>
      </div>
      <CornerCrosshairs />
    </MotionLink>
  )
}

function CompactCard({
  entry,
  variant,
  sectionNumber,
}: {
  entry: ExperienceEntry
  variant: CompactCardVariant
  sectionNumber?: string
}) {
  const { locale } = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const title = pickLocalized(entry as unknown as Record<string, unknown>, 'title', locale)
  const missionsToShow = locale === 'vi' && entry.missions_vi ? entry.missions_vi : entry.missions
  const kind = getExperienceKind(entry.slug)
  const isWide = variant === 'wide'
  const missionLimit = isWide ? 2 : 1
  const skillsLimit = isWide ? 4 : 3
  const achievementsLimit = isWide ? 3 : 2
  const accentTextClass = isWarmKind(kind)
    ? 'text-[rgb(var(--accent-warm))]'
    : 'text-[rgb(var(--accent))]'
  const accentBorderClass = isWarmKind(kind)
    ? 'hover:border-[rgb(var(--accent-warm)/0.82)] hover:ring-[rgb(var(--accent-warm)/0.48)]'
    : 'hover:border-[rgb(var(--accent)/0.85)] hover:ring-[rgb(var(--accent)/0.55)]'
  const missionMarkerClass = isWarmKind(kind)
    ? 'bg-[rgb(var(--accent-warm))]'
    : 'bg-[rgb(var(--accent))]'
  const displaySectionNumber = sectionNumber ?? entry.id.slice(-2).padStart(2, '0')
  const missions = missionsToShow.slice(0, missionLimit)
  const titleClass = isWide
    ? 'text-2xl leading-[1.08] sm:text-[1.7rem]'
    : 'text-[1.35rem] leading-[1.12]'
  const logoSize: PixelLogoSize = isWide ? 'detail' : 'compact'
  const logoPanelClass = isWide
    ? 'flex min-h-[15rem] items-center justify-center border-b border-[rgb(var(--border)/0.76)] px-7 py-8 lg:min-h-full lg:border-b-0 lg:border-r lg:px-8'
    : 'flex min-h-[12.5rem] items-center justify-center border-b border-[rgb(var(--border)/0.76)] px-6 py-6'
  const contentClass = isWide
    ? 'flex min-h-full flex-col px-6 py-6 sm:px-7 sm:py-7 lg:px-8'
    : 'flex flex-1 flex-col px-5 py-5 sm:px-6 sm:py-6'

  return (
    <article className="h-full">
      <MotionLink
        href={`/experience/${entry.slug}`}
        aria-label={`View experience entry ${entry.id} — ${title} at ${entry.company}`}
        className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-[28px] border border-[rgb(var(--border))] bg-[rgb(var(--surface-card))] shadow-[var(--shadow-card)] transition-[transform,box-shadow,border-color] duration-500 hover:shadow-[var(--shadow-elevated)] hover:ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--accent))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--surface-page))] motion-reduce:transition-none ${accentBorderClass} ${isWide ? 'lg:min-h-[25rem]' : 'min-h-[30rem]'}`}
        initial={shouldReduceMotion ? undefined : 'rest'}
        animate={shouldReduceMotion ? undefined : 'rest'}
        whileHover={shouldReduceMotion ? undefined : 'hover'}
        whileTap={shouldReduceMotion ? undefined : 'tap'}
        variants={shouldReduceMotion ? undefined : cardVariants}
        style={{ ...cardTransitionStyle, willChange: shouldReduceMotion ? undefined : 'transform' }}
      >
        <HoverSideRail kind={kind} />
        <AccentHalo kind={kind} />
        <SectionNumber value={displaySectionNumber} />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
          style={{
            ...cardTransitionStyle,
            backgroundImage: `radial-gradient(circle at 94% 6%, rgb(${getAccentRgbToken(kind)} / 0.12), transparent 34%), linear-gradient(135deg, rgb(var(--surface-overlay) / 0.22), transparent 48%)`,
          }}
        />
        <div
          className={`relative z-10 h-full ${isWide ? 'lg:grid lg:grid-cols-[2fr_3fr]' : 'flex flex-col'}`}
        >
          <div className={logoPanelClass}>
            {shouldReduceMotion ? (
              <ExperienceLogo entry={entry} title={title} size={logoSize} />
            ) : (
              <motion.div
                variants={logoVariants}
                style={{ willChange: 'transform, filter' }}
              >
                <ExperienceLogo entry={entry} title={title} size={logoSize} />
              </motion.div>
            )}
          </div>

          <div className={contentClass}>
            <EditorialTagRow
              kind={kind}
              dates={entry.dates}
              id={entry.id}
              compact={!isWide}
            />

            <div className="relative mt-5 inline-block pb-3">
              <h3
                className={`${titleClass} font-semibold tracking-[-0.03em] text-[rgb(var(--text-primary))]`}
              >
                {title}
              </h3>
              <HoverUnderline />
            </div>

            <p
              className={`mt-1 font-mono text-[12px] font-semibold uppercase tracking-[0.18em] ${accentTextClass}`}
            >
              {entry.company}
            </p>

            {missions.length > 0 ? (
              <ul className={`mt-5 space-y-3 ${isWide ? 'max-w-[48rem]' : ''}`}>
                {missions.map((mission, index) => (
                  <li key={`${entry.id}-mission-${index}`} className="flex gap-3">
                    <span
                      aria-hidden="true"
                      className={`mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full ${missionMarkerClass}`}
                    />
                    <p
                      className={`font-mono text-[12px] leading-relaxed text-[rgb(var(--text-secondary))] ${isWide ? 'line-clamp-3' : 'line-clamp-4'}`}
                    >
                      {trimMission(mission, isWide ? 260 : 190)}
                    </p>
                  </li>
                ))}
              </ul>
            ) : null}

            <AchievementsRow
              items={extractAchievements(entry.missions, achievementsLimit)}
              dense
            />

            {entry.skills.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {entry.skills.slice(0, skillsLimit).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.78)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-[rgb(var(--text-secondary))]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : null}

            <div className="mt-auto pt-7">
              <OpenLogCta
                label="Open log"
                slug={entry.slug}
                reduceMotion={!!shouldReduceMotion}
                kind={kind}
                size={isWide ? 'default' : 'compact'}
              />
            </div>
          </div>
        </div>

        <CornerCrosshairs kind={kind} />
      </MotionLink>
    </article>
  )
}

function WhatsNextCard({ entry }: { entry: ExperienceEntry }) {
  const { locale } = useLocale()
  const shouldReduceMotion = useReducedMotion()
  const title = pickLocalized(entry as unknown as Record<string, unknown>, 'title', locale)
  const quote = pickLocalized(entry as unknown as Record<string, unknown>, 'quote', locale)
  const kind = getExperienceKind(entry.slug)

  return (
    <motion.article
      className="group relative overflow-hidden rounded-[30px] border border-dashed border-[rgb(var(--border-muted)/0.58)] bg-[rgb(var(--surface-card)/0.82)] px-6 py-6 shadow-[var(--shadow-card)] backdrop-blur-sm transition-[transform,box-shadow,border-color,background-color] duration-500 hover:border-[rgb(var(--accent-warm)/0.62)] hover:bg-[rgb(var(--surface-card)/0.94)] hover:shadow-[var(--shadow-elevated)] motion-reduce:transition-none sm:px-8 sm:py-8"
      whileHover={shouldReduceMotion ? undefined : { y: -3 }}
      transition={shouldReduceMotion ? undefined : SPRING_SOFT}
      style={{ ...cardTransitionStyle, willChange: shouldReduceMotion ? undefined : 'transform' }}
    >
      <style>
        {`
          @keyframes exp-open-slot-glitch {
            0%, 92%, 100% { transform: translate3d(0, 0, 0); }
            94% { transform: translate3d(2px, -1px, 0); }
            96% { transform: translate3d(-1px, 1px, 0); }
            98% { transform: translate3d(1px, 0, 0); }
          }

          .exp-open-slot-glyph {
            animation: exp-open-slot-glitch 4s infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .exp-open-slot-glyph {
              animation: none;
            }
          }
        `}
      </style>
      <HoverSideRail kind={kind} />
      <AccentHalo kind={kind} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            'linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px), linear-gradient(rgb(var(--border)) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 motion-reduce:transition-none"
        style={{
          ...cardTransitionStyle,
          backgroundImage:
            'radial-gradient(circle at 92% 12%, rgb(var(--accent-warm) / 0.12), transparent 34%)',
        }}
      />

      <div className="relative z-10 grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_240px] lg:items-center">
        <div className="flex min-h-[10rem] items-center justify-center border-b border-dashed border-[rgb(var(--border-muted)/0.5)] pb-5 lg:min-h-[12rem] lg:border-b-0 lg:border-r lg:pb-0 lg:pr-8">
          <div className="exp-open-slot-glyph font-mono text-[7rem] font-semibold leading-none tracking-normal text-[rgb(var(--accent-warm)/0.25)] sm:text-[9rem]">
            ??
          </div>
        </div>

        <div className="min-w-0 text-left">
          <EditorialTagRow kind={kind} id={entry.id} />
          <h3 className="mt-5 max-w-2xl text-3xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))] sm:text-[2.35rem]">
            {title}
          </h3>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.24em] text-[rgb(var(--accent-warm))]">
            {entry.company}
          </p>
          {quote ? (
            <p className="mt-5 max-w-2xl border-l border-[rgb(var(--accent-warm)/0.45)] pl-4 font-mono text-sm italic leading-relaxed text-[rgb(var(--text-secondary))] sm:text-[15px]">
              &ldquo;{quote}&rdquo;
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start gap-4 border-t border-dashed border-[rgb(var(--border-muted)/0.5)] pt-5 font-mono uppercase lg:items-end lg:border-t-0 lg:pt-0">
          <span className="rounded-full border border-[rgb(var(--accent-warm)/0.45)] bg-[rgb(var(--accent-warm)/0.1)] px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-[rgb(var(--accent-warm))]">
            request a slot
          </span>
          <div className="grid gap-2 text-left text-[10px] tracking-[0.22em] text-[rgb(var(--text-muted))] lg:text-right">
            <span className="text-[rgb(var(--border-muted))]">calendar</span>
            <span className="text-[rgb(var(--text-secondary))]">2026 onward</span>
          </div>
          <span className="rounded-md border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.62)] px-2.5 py-1 text-[10px] tracking-[0.18em] text-[rgb(var(--text-muted))]">
            checksum: {entry.checksum}
          </span>
        </div>
      </div>
    </motion.article>
  )
}
