'use client'

import { useState } from 'react'
import PhotoCard from './photo-card'

interface PhotoData {
  title: string
  slug: string
  category: string
  camera: string
  lens: string
  location: string
  date: string
  description: string
  story: string
  image: string
  alt: string
}

interface PhotoGalleryProps {
  photos: PhotoData[]
}

type FilterCategory = 'all' | 'portrait' | 'street'

export default function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('all')

  let portraitCount = 0, streetCount = 0
  for (const p of photos) {
    if (p.category === 'portrait') portraitCount++
    else if (p.category === 'street') streetCount++
  }

  const filtered =
    activeFilter === 'all'
      ? photos
      : photos.filter((p) => p.category === activeFilter)

  const filters: { key: FilterCategory; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: photos.length },
    { key: 'portrait', label: 'Portrait', count: portraitCount },
    { key: 'street', label: 'Street', count: streetCount },
  ]

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-5 md:px-6 lg:px-8 py-12">
      <h2 className="text-4xl font-bold text-white text-center mb-8">
        People In Frames
      </h2>

      {/* Filter buttons - terminal style */}
      <div className="flex items-center justify-center gap-3 mb-10">
        {filters.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 text-sm font-medium font-mono border-2 transition-all duration-300 ease-out transform hover:scale-105 ${
              activeFilter === key
                ? 'border-[rgb(var(--accent))] text-[rgb(var(--accent))] bg-[rgb(var(--accent))]/20 shadow-lg shadow-[rgb(var(--accent))]/20 scale-105'
                : 'border-[rgb(var(--border))] text-[rgb(var(--text-secondary))] hover:border-[rgb(var(--accent))] hover:text-[rgb(var(--accent))] hover:shadow-md'
            }`}
          >
            $ls {label.toLowerCase()}({count})
          </button>
        ))}
      </div>

      {/* Photo grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filtered.map((photo) => (
          <PhotoCard key={photo.slug} photo={photo} />
        ))}
      </div>
    </section>
  )
}
