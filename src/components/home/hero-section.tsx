import Image from 'next/image'
import { SocialLinks } from '@/components/social-links'

export function HeroSection() {
  return (
    <div className="flex flex-col items-center gap-6">
      {/* Profile image */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative w-24 h-24 md:w-[120px] md:h-[120px] lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-[rgb(var(--accent))] shadow-[0_0_0_4px_rgba(102,252,241,0.15),0_0_20px_rgba(102,252,241,0.25)]">
        <Image
          src="/images/profile/headshot_base.png"
          alt="Duy Le"
          fill
          className="object-cover"
          priority
        />
        </div>
      </div>

      {/* Social links */}
      <SocialLinks />

      {/* Welcome text */}
      <p className="text-sm font-mono text-center leading-relaxed text-[rgb(var(--text-secondary))]">
        Welcome to{' '}
        <span className="text-[rgb(var(--accent))] font-semibold">DUYLE.JS</span>{' '}
        where you can find out more about me!
      </p>
    </div>
  )
}
