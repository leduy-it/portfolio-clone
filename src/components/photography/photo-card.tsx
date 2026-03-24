import Image from 'next/image'

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

interface PhotoCardProps {
  photo: PhotoData
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div className="relative w-full aspect-square overflow-hidden group cursor-pointer rounded-lg">
      <Image
        src={photo.image}
        alt={photo.alt}
        fill
        className="object-cover object-center transition-all duration-500 ease-out group-hover:scale-110 group-hover:brightness-110"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
      {/* Hover overlay with metadata */}
      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
        <p className="text-white text-sm font-semibold leading-tight">{photo.title}</p>
        <div className="mt-1 space-y-0.5 text-xs text-white/70 font-mono">
          <p>{photo.camera}</p>
          <p>{photo.lens}</p>
          <p>{photo.location}</p>
        </div>
      </div>
    </div>
  )
}
