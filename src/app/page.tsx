import dynamic from 'next/dynamic'
import { SUGGESTIONS } from '@/data/terminal-suggestions'

const HomeBackgroundWrapper = dynamic(
  () => import('@/components/home/home-background-wrapper').then(m => ({ default: m.HomeBackgroundWrapper })),
)

const TerminalChat = dynamic(
  () => import('@/components/home/terminal-chat').then(m => ({ default: m.TerminalChat })),
  { loading: () => <div className="w-full h-[320px] rounded-lg border border-[rgb(var(--border))] bg-[rgb(var(--surface-card))] animate-pulse" /> }
)

const HeroSection = dynamic(
  () => import('@/components/home/hero-section').then(m => ({ default: m.HeroSection })),
)

export default function HomePage() {
  return (
    <div className="relative min-h-[calc(100vh-120px)] overflow-hidden">
      <HomeBackgroundWrapper />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" style={{ zIndex: 10 }}>
        {/* Desktop: two-column layout. Mobile/tablet: stacked */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          {/* Left column: hero (1/3 width, centered content) */}
          <div className="w-full lg:w-1/3 flex flex-col lg:h-[500px] items-center">
            <HeroSection />
          </div>

          {/* Right column: terminal chat + suggestions (2/3 width) */}
          <div className="flex-1 w-full">
            <TerminalChat />

            {/* Suggestion hints below terminal */}
            <p className="mt-4 text-xs font-mono text-[rgb(var(--text-muted))] text-center">
              {'Try: '}
              {SUGGESTIONS.map((s, i) => (
                <span key={s}>
                  {i > 0 && <span className="mx-1 opacity-50">•</span>}
                  <span className="text-[rgb(var(--text-muted))] hover:text-[rgb(var(--accent))] cursor-default transition-colors duration-200">
                    &quot;{s}&quot;
                  </span>
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
