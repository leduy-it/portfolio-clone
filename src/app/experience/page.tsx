import { SystemHeader } from '@/components/experience/system-header'
import { ExperienceCard } from '@/components/experience/experience-card'
import experienceData from '@/data/experience.json'

export default function ExperiencePage() {
  const [featured, ...rest] = experienceData
  const grid = rest.slice(0, 6) // entries 002–007
  const whatsNext = rest[6]    // entry 008

  return (
    <main className="min-h-screen bg-[color:var(--color-background)] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">

        {/* Page heading */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 font-mono text-4xl font-semibold text-[color:var(--color-text-primary)] sm:text-5xl">
            &lt;ExperienceDex /&gt;
          </h1>
          <p className="font-mono text-sm italic text-[color:var(--color-text-muted)]">
            &ldquo;Collecting experiences, populating the dex-entry by entry.&rdquo;
          </p>
        </div>

        {/* System status bar */}
        <div className="mb-10 flex justify-center">
          <SystemHeader count={7} checksum="0x1A4A" />
        </div>

        {/* Featured card (#001) */}
        <div className="mb-8">
          <ExperienceCard entry={featured} featured />
        </div>

        {/* Grid: #002–#007 */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grid.map((entry) => (
            <ExperienceCard key={entry.id} entry={entry} />
          ))}
        </div>

        {/* What's Next card (#008) */}
        {whatsNext && (
          <div className="mx-auto max-w-sm">
            <ExperienceCard entry={whatsNext} />
          </div>
        )}
      </div>
    </main>
  )
}
