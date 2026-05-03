'use client'

import { SystemHeader } from '@/components/experience/system-header'
import { ExperienceCard } from '@/components/experience/experience-card'
import { ExperienceTimelineReveal } from '@/components/experience/experience-timeline-reveal'
import { PixelDivider } from '@/components/pixel-divider'
import { useLocale } from '@/lib/i18n'
import experienceData from '@/data/experience.json'

const HERO_CHECKSUM = '0x7D3'
const LAST_UPDATED = '2026-05'
const CURRENT_YEAR = 2026

const BENTO_CARD_LAYOUT: Record<
  string,
  { className: string; variant: 'wide' | 'narrow' }
> = {
  'gmo-runsystem': {
    className: 'lg:col-span-7',
    variant: 'wide',
  },
  smartpay: {
    className: 'lg:col-span-5',
    variant: 'narrow',
  },
  'soict-hackathon': {
    className: 'lg:col-span-5',
    variant: 'narrow',
  },
  'hcmc-dost-award': {
    className: 'lg:col-span-7',
    variant: 'wide',
  },
}

function parseArchiveStartYear() {
  const years = experienceData.flatMap((entry) => {
    const matches = entry.dates.match(/\b20\d{2}\b/g)
    return matches ? matches.map(Number) : []
  })

  return years.length > 0 ? Math.min(...years) : CURRENT_YEAR
}

export default function ExperiencePage() {
  const { t } = useLocale()
  const entryCount = Math.max(0, experienceData.length - 1)
  const featured = experienceData[0]
  const whatsNext = experienceData[experienceData.length - 1]
  const grid = experienceData.slice(1, -1)
  const archiveStartYear = parseArchiveStartYear()
  const uptimeYears = String(
    Math.max(1, CURRENT_YEAR - archiveStartYear)
  ).padStart(2, '0')

  return (
    <main className="min-h-screen bg-[rgb(var(--surface-page))]">
      {/* Full-bleed hero band — matches /blog and /photography rhythm */}
      <section className="relative overflow-hidden border-b border-[rgb(var(--border))]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 14% 10%, rgb(var(--accent) / 0.13), transparent 38%), radial-gradient(circle at 88% 84%, rgb(var(--accent-warm) / 0.10), transparent 35%)',
          }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(90deg, rgb(var(--border)) 1px, transparent 1px), linear-gradient(rgb(var(--border)) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="relative mx-auto max-w-[1440px] px-6 py-14 sm:px-8 lg:px-12 lg:py-16">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[rgb(var(--accent))]">
                experience · log
              </p>
              <h1
                className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[rgb(var(--text-primary))] sm:text-5xl lg:text-6xl"
                style={{ textShadow: '4px 4px 0 rgb(var(--accent) / 0.10)' }}
              >
                {t('experience.heading')}
              </h1>
              <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-[rgb(var(--text-secondary))] sm:text-base">
                {t('experience.tagline')}
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-[11px] uppercase tracking-[0.22em] text-[rgb(var(--text-muted))]">
                <span>/experience</span>
                <span className="text-[rgb(var(--border-muted))]">·</span>
                <span>
                  #001 → #{whatsNext?.id ?? featured?.id}
                </span>
                <span className="text-[rgb(var(--border-muted))]">·</span>
                <span>
                  {t('experience.checksum')}: {HERO_CHECKSUM}
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.85)] p-5 shadow-[var(--shadow-card)] backdrop-blur-sm">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[rgb(var(--text-muted))]">
                archive ledger
              </div>
              <div className="mt-4 space-y-3 font-mono text-xs text-[rgb(var(--text-secondary))]">
                <div className="flex items-center justify-between gap-4 border-b border-[rgb(var(--border)/0.8)] pb-3">
                  <span className="text-[rgb(var(--text-muted))]">primary log</span>
                  <span className="text-[rgb(var(--text-primary))]">#{featured?.id}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[rgb(var(--border)/0.8)] pb-3">
                  <span className="text-[rgb(var(--text-muted))]">verified entries</span>
                  <span className="text-[rgb(var(--text-primary))]">
                    {String(entryCount).padStart(2, '0')}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-[rgb(var(--border)/0.8)] pb-3">
                  <span className="text-[rgb(var(--text-muted))]">archive span</span>
                  <span className="text-[rgb(var(--text-primary))]">
                    {archiveStartYear} → {CURRENT_YEAR}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[rgb(var(--text-muted))]">future slot</span>
                  <span className="text-[rgb(var(--accent-warm))]">
                    #{whatsNext?.id ?? '--'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[rgb(var(--text-muted))]">
            <div className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay))] px-3 py-1.5">
              <span className="text-[rgb(var(--accent))]">
                {t('experience.entries')}
              </span>
              <span className="ml-2 text-[rgb(var(--text-primary))]">
                {String(entryCount).padStart(2, '0')}
              </span>
            </div>
            <div className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay))] px-3 py-1.5">
              <span className="text-[rgb(var(--accent))]">
                {t('experience.lastUpdated')}
              </span>
              <span className="ml-2 text-[rgb(var(--text-primary))]">{LAST_UPDATED}</span>
            </div>
            <div className="rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay))] px-3 py-1.5">
              <span className="text-[rgb(var(--accent))]">uptime</span>
              <span className="ml-2 text-[rgb(var(--text-primary))]">{uptimeYears}Y</span>
            </div>
          </div>

          <PixelDivider className="mt-8 opacity-85" />
          <SystemHeader className="mt-5" count={entryCount} checksum={HERO_CHECKSUM} />
        </div>
      </section>

      {/* Cards section — width + padding match the hero band exactly for edge-aligned composition */}
      <div className="mx-auto max-w-[1440px] px-6 pb-20 pt-12 sm:px-8 lg:px-12 lg:pt-14">
        {featured ? (
          <ExperienceTimelineReveal className="mb-8" direction="left">
            <ExperienceCard entry={featured} featured />
          </ExperienceTimelineReveal>
        ) : null}

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-7 lg:grid-cols-12 xl:gap-8">
          {grid.map((entry, index) => {
            const layout = BENTO_CARD_LAYOUT[entry.slug] ?? {
              className: 'lg:col-span-6',
              variant: 'narrow' as const,
            }

            return (
              <ExperienceTimelineReveal
                key={entry.id}
                className={`min-w-0 ${layout.className}`}
                delay={(index + 1) * 0.08}
                direction={index % 2 === 0 ? 'left' : 'right'}
              >
                <ExperienceCard
                  entry={entry}
                  variant={layout.variant}
                  sectionNumber={String(index + 1).padStart(2, '0')}
                />
              </ExperienceTimelineReveal>
            )
          })}
        </div>

        {whatsNext ? (
          <ExperienceTimelineReveal
            delay={(grid.length + 1) * 0.08}
            direction="right"
          >
            <ExperienceCard entry={whatsNext} />
          </ExperienceTimelineReveal>
        ) : null}
      </div>
    </main>
  )
}
