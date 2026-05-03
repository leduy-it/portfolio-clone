import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from '@/components/theme-provider'
import { LocaleProvider } from '@/lib/i18n'
import { Header } from '@/components/header'
import { CursorGlow, PageTransition } from '@/components/motion'
import { VisitorTracker } from '@/components/visitor-tracker'
import { MysteryBox } from '@/components/mystery-box'
import { SecretHint } from '@/components/secret-hint'
import './globals.css'

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
})

import { buildMetadataOg } from '@/lib/og-meta'

export const metadata: Metadata = buildMetadataOg({
  title: 'michael.py — AI Engineer building at the OCR + agents intersection',
  description: 'Personal portfolio of Duy Le — AI Engineer working across OCR, Document AI, and LLM agents in Ho Chi Minh City.',
  route: 'home',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${jetbrainsMono.variable} font-mono antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <LocaleProvider>
            <CursorGlow />
            <Header />
            <main className="min-h-screen">
              <PageTransition>{children}</PageTransition>
            </main>
            <VisitorTracker />
            <SecretHint />
            <MysteryBox />
          </LocaleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
