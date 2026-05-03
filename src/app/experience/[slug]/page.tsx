import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ExperienceDetailView, type ExperienceEntry } from '@/components/experience/experience-detail-view'
import { buildMetadataOg } from '@/lib/og-meta'
import experienceData from '@/data/experience.json'

interface PageParams {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return experienceData.map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({ params }: PageParams): Promise<Metadata> {
  const { slug } = await params
  const entry = experienceData.find((e) => e.slug === slug)
  if (!entry) return { title: 'Not found — leduy.py' }
  return buildMetadataOg({
    title: `${entry.title} @ ${entry.company} — leduy.py`,
    description: entry.quote || `${entry.title} at ${entry.company}.`,
    route: 'experience-detail',
  })
}

export default async function ExperienceDetailPage({ params }: PageParams) {
  const { slug } = await params
  const entry = experienceData.find((e) => e.slug === slug)
  if (!entry) notFound()

  return <ExperienceDetailView entry={entry as ExperienceEntry} />
}
