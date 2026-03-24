import Image from 'next/image'
import Link from 'next/link'

interface ExperienceEntry {
  id: string
  slug: string
  title: string
  company: string
  dates: string
  quote: string
  missions: string[]
  skills: string[]
  image: string
  logo: string | null
  checksum: string
}

interface ExperienceCardProps {
  entry: ExperienceEntry
  featured?: boolean
}

export function ExperienceCard({ entry, featured = false }: ExperienceCardProps) {
  const isWhatsNext = entry.slug === 'whats-next'

  if (isWhatsNext) {
    return <WhatsNextCard entry={entry} />
  }

  if (featured) {
    return <FeaturedCard entry={entry} />
  }

  return <CompactCard entry={entry} />
}

function FeaturedCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[color:var(--color-accent)]">
      {/* Entry number */}
      <span className="absolute right-6 top-6 z-10 font-mono text-sm font-bold text-[color:var(--color-accent)]">
        #{entry.id}
      </span>

      <div className="grid md:grid-cols-5">
        {/* Image section — left 2/5 */}
        {entry.image && (
          <div className="md:col-span-2 flex items-center justify-center p-8 md:p-12">
            <div className="relative h-44 w-44 overflow-hidden rounded-lg">
              <Image
                src={entry.image}
                alt={entry.title}
                fill
                className="object-contain group-hover:scale-105 transition-transform duration-500"
                sizes="176px"
              />
            </div>
          </div>
        )}

        {/* Content section — right 3/5 */}
        <div className="md:col-span-3 p-8 md:p-12 flex flex-col justify-center bg-[color:var(--color-surface-card)]/50">
          {/* Date */}
          {entry.dates && (
            <div className="mb-3 flex items-center gap-2 font-mono text-xs text-[color:var(--color-text-muted)]">
              <span className="text-[color:var(--color-accent)]">📅</span>
              <span>{entry.dates}</span>
            </div>
          )}

          {/* Title */}
          <h2 className="mb-2 font-mono text-xl font-bold uppercase tracking-wide text-[color:var(--color-text-primary)]">
            {entry.title}
          </h2>

          {/* Company */}
          <p className="mb-4 font-mono text-sm font-semibold text-[color:var(--color-accent)]">
            {entry.company}
          </p>

          {/* Mission (first bullet) */}
          {entry.missions.length > 0 && (
            <p className="mb-5 font-mono text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              {entry.missions[0]}
            </p>
          )}

          {/* Skills */}
          {entry.skills.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {entry.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded border border-[color:var(--color-border)] px-2 py-0.5 font-mono text-xs text-[color:var(--color-text-muted)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}

          {/* View link */}
          <Link
            href={`/experience/${entry.slug}`}
            className="font-mono text-xs text-[color:var(--color-accent)] transition-colors hover:text-[color:var(--color-accent-hover)]"
          >
            $ view --slug {entry.slug}
          </Link>
        </div>
      </div>
    </div>
  )
}

function CompactCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="group relative flex h-full flex-col rounded-2xl border border-[color:var(--color-border)] bg-[color:var(--color-surface-card)] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-[color:var(--color-accent)]">
      {/* Entry number */}
      <span className="absolute right-4 top-4 z-10 font-mono text-xs font-bold text-[color:var(--color-accent)]">
        #{entry.id}
      </span>

      {/* Image — centered at top */}
      {entry.image && (
        <div className="flex items-center justify-center pt-8 pb-4">
          <div className="relative h-32 w-32 overflow-hidden rounded-lg">
            <Image
              src={entry.image}
              alt={entry.title}
              fill
              className="object-contain group-hover:scale-105 transition-transform duration-500"
              sizes="128px"
            />
          </div>
        </div>
      )}

      {/* Content */}
      <div className="flex flex-1 flex-col px-6 pb-6">
        {/* Date */}
        {entry.dates && (
          <div className="mb-2 flex items-center gap-1 font-mono text-xs text-[color:var(--color-text-muted)]">
            <span className="text-[color:var(--color-accent)] text-[10px]">📅</span>
            <span>{entry.dates}</span>
          </div>
        )}

        {/* Title */}
        <h3 className="mb-1 font-mono text-sm font-bold uppercase tracking-wide text-[color:var(--color-text-primary)]">
          {entry.title}
        </h3>

        {/* Company */}
        <p className="mb-3 font-mono text-xs text-[color:var(--color-accent)]">
          {entry.company}
        </p>

        {/* Skills */}
        {entry.skills.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-1">
            {entry.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded border border-[color:var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] text-[color:var(--color-text-muted)]"
              >
                {skill}
              </span>
            ))}
          </div>
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* View link */}
        <Link
          href={`/experience/${entry.slug}`}
          className="font-mono text-[10px] text-[color:var(--color-accent)] transition-colors hover:text-[color:var(--color-accent-hover)]"
        >
          $ view --slug {entry.slug}
        </Link>
      </div>
    </div>
  )
}

function WhatsNextCard({ entry }: { entry: ExperienceEntry }) {
  return (
    <div className="group relative flex flex-col items-center justify-center rounded-2xl border border-dashed border-[color:var(--color-border-muted)] bg-[color:var(--color-surface-card)] p-8 text-center transition-all duration-300 hover:border-[color:var(--color-accent)] hover:shadow-lg hover:shadow-[color:var(--color-accent)]/5">
      {/* Entry number */}
      <span className="absolute right-4 top-4 font-mono text-xs font-bold text-[color:var(--color-text-muted)]">
        #{entry.id}
      </span>

      {/* Question marks */}
      <div className="mb-4 font-mono text-4xl text-[color:var(--color-text-muted)] opacity-50">
        ???
      </div>

      {/* Title */}
      <h3 className="mb-1 font-mono text-sm font-bold uppercase tracking-wide text-[color:var(--color-text-primary)]">
        {entry.title}
      </h3>

      {/* Company */}
      <p className="mb-4 font-mono text-xs text-[color:var(--color-text-muted)]">
        {entry.company}
      </p>

      {/* Quote */}
      {entry.quote && (
        <p className="font-mono text-xs italic text-[color:var(--color-text-muted)]">
          &ldquo;{entry.quote}&rdquo;
        </p>
      )}

      {/* Checksum */}
      <div className="mt-4 font-mono text-[10px] text-[color:var(--color-border-muted)]">
        CHECKSUM: {entry.checksum}
      </div>
    </div>
  )
}
