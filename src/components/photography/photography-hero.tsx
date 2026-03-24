import Image from 'next/image'

export default function PhotographyHero() {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      <Image
        src="/images/photography/beekkant-station.webp"
        alt="Brussels Beekkant station"
        fill
        className="object-cover object-center"
        priority
      />
      {/* Dark overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-3">
          Photography Portfolio
        </h1>
        <p className="text-2xl sm:text-3xl font-bold text-white/80 italic">
          Capturing Moments, One Frame at a Time
        </p>
      </div>
    </div>
  )
}
