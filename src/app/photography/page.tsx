import photographyData from '@/data/photography.json'
import PhotographyHero from '@/components/photography/photography-hero'
import PhotoGallery from '@/components/photography/photo-gallery'

export default function PhotographyPage() {
  return (
    <main className="min-h-screen bg-[rgb(var(--background))]">
      <PhotographyHero />
      <PhotoGallery photos={photographyData} />
    </main>
  )
}
