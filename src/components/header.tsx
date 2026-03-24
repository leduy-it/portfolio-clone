'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from './theme-toggle'

const navLinks = [
  { label: 'About Me', href: '/' },
  { label: 'Experience', href: '/experience' },
  { label: 'Blog', href: '/blog' },
  { label: 'Photography', href: '/photography' },
]

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="py-5 xl:py-8 text-foreground bg-[rgb(var(--surface-page))] relative" style={{ zIndex: 30 }}>
      <div className="container mx-auto flex justify-between items-center max-w-7xl px-4 sm:px-5 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            Duyle<span className="text-[rgb(var(--accent))]">.js</span>
          </h1>
        </Link>

        {/* Desktop nav + controls — visible at xl and up */}
        <div className="hidden xl:flex items-center gap-8">
          <nav className="flex gap-8">
            {navLinks.map(({ label, href }) => {
              const isActive = pathname === href
              return (
                <Link
                  key={href}
                  href={href}
                  className={`capitalize font-medium transition-colors duration-200 pb-0.5 ${
                    isActive
                      ? 'text-[rgb(var(--accent))] border-b-2 border-[rgb(var(--accent))]'
                      : 'hover:text-[rgb(var(--accent))]'
                  }`}
                >
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/Benedict_Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold uppercase bg-[rgb(var(--background))] border-2 border-[rgb(var(--accent))] text-[rgb(var(--accent))] rounded-lg transition-all duration-200 hover:-translate-x-1.5 hover:-translate-y-1.5 hover:text-[rgb(var(--background))] hover:bg-[rgb(var(--accent))]"
            >
              Resume
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Mobile: theme toggle + hamburger (below xl) */}
        <div className="flex xl:hidden items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
            className="w-9 h-9 flex flex-col items-center justify-center gap-1.5"
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="rgb(var(--accent))" strokeWidth="2" strokeLinecap="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <>
                <span className="w-5 h-0.5 bg-[rgb(var(--accent))]" />
                <span className="w-5 h-0.5 bg-[rgb(var(--accent))]" />
                <span className="w-3 h-0.5 bg-[rgb(var(--accent))] self-end" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {mobileOpen ? (
        <div className="xl:hidden bg-[rgb(var(--surface-page))] border-t border-[rgb(var(--border))] px-4 py-4 flex flex-col gap-3 mt-2">
          {navLinks.map(({ label, href }) => {
            const isActive = pathname === href
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`capitalize font-medium py-2 border-b border-[rgb(var(--border))] transition-colors duration-200 ${
                  isActive ? 'text-[rgb(var(--accent))]' : 'hover:text-[rgb(var(--accent))]'
                }`}
              >
                {label}
              </Link>
            )
          })}
          <Link
            href="/Benedict_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setMobileOpen(false)}
            className="mt-2 inline-flex items-center gap-2 px-6 py-3 text-lg font-semibold uppercase bg-[rgb(var(--background))] border-2 border-[rgb(var(--accent))] text-[rgb(var(--accent))] rounded-lg transition-all duration-200 hover:-translate-x-1.5 hover:-translate-y-1.5 hover:text-[rgb(var(--background))] hover:bg-[rgb(var(--accent))] w-fit"
          >
            Resume
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
          </Link>
        </div>
      ) : null}
    </header>
  )
}
