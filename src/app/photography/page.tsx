import dynamic from 'next/dynamic'
import photographyData from '@/data/photography.json'
import PhotographyHero from '@/components/photography/photography-hero'

const PhotoGallery = dynamic(
  () => import('@/components/photography/photo-gallery'),
  { loading: () => <div className="max-w-7xl mx-auto px-4 py-12 h-96 animate-pulse" /> }
)

export default function PhotographyPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--background))]">
      <PhotographyHero />
      <PhotoGallery photos={photographyData} />
    </main>
  )
}
