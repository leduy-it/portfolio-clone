'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useReducedMotion } from 'motion/react'
import type { Locale } from '@/lib/i18n'

export interface ExperienceGalleryItem {
  src: string
  caption?: string
  caption_vi?: string
  alt?: string
}

interface ExperienceGalleryProps {
  heading: string
  items: ExperienceGalleryItem[]
  locale: Locale
}

function getCaption(item: ExperienceGalleryItem, locale: Locale) {
  if (locale === 'vi' && item.caption_vi) {
    return item.caption_vi
  }
  return item.caption ?? ''
}

export function ExperienceGallery({ heading, items, locale }: ExperienceGalleryProps) {
  const shouldReduceMotion = useReducedMotion()
  const [loaded, setLoaded] = useState<Record<string, boolean>>({})

  if (items.length === 0) {
    return null
  }

  const isSingle = items.length === 1

  const renderImage = (item: ExperienceGalleryItem, index: number) => {
    const caption = getCaption(item, locale)
    const imageKey = `${item.src}-${index}`
    const isLoaded = loaded[imageKey] || shouldReduceMotion

    return (
      <figure key={imageKey} className={isSingle ? 'w-full' : 'min-w-0'}>
        <div
          className={[
            'group relative w-full overflow-hidden border border-[color:var(--color-border-muted)] bg-black',
            isSingle
              ? 'aspect-[4/5] rounded-2xl sm:aspect-[16/10]'
              : 'aspect-[4/5] rounded-xl sm:aspect-[3/4]',
          ].join(' ')}
          style={isSingle ? { boxShadow: 'var(--shadow-elevated)' } : { boxShadow: 'var(--shadow-card)' }}
        >
          {/* Blurred backdrop fills empty space when image aspect ≠ container */}
          <Image
            src={item.src}
            alt=""
            aria-hidden="true"
            fill
            className="object-cover scale-110 blur-2xl opacity-50"
            sizes={
              isSingle
                ? '(min-width: 1024px) 896px, 100vw'
                : '(min-width: 1024px) 292px, (min-width: 768px) 50vw, 100vw'
            }
          />
          {/* Foreground image — contained, sharp */}
          <Image
            src={item.src}
            alt={item.alt ?? caption}
            fill
            className={[
              'relative object-contain transition-[filter,opacity,transform] duration-700 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
              isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-[12px]',
              shouldReduceMotion ? '' : 'group-hover:scale-[1.015]',
            ].join(' ')}
            sizes={
              isSingle
                ? '(min-width: 1024px) 896px, 100vw'
                : '(min-width: 1024px) 292px, (min-width: 768px) 50vw, 100vw'
            }
            quality={95}
            priority={isSingle && index === 0}
            onLoad={() => setLoaded((current) => ({ ...current, [imageKey]: true }))}
          />
        </div>
        {caption && (
          <figcaption
            className={[
              'mt-3 max-w-prose font-mono italic leading-relaxed text-[color:var(--color-text-secondary)]/85',
              isSingle ? 'px-1 text-sm sm:text-[15px]' : 'px-1 text-xs',
            ].join(' ')}
          >
            {caption}
          </figcaption>
        )}
      </figure>
    )
  }

  return (
    <section className="mt-10" aria-labelledby="experience-gallery-heading">
      <h2
        id="experience-gallery-heading"
        className="mb-4 font-mono text-xs uppercase tracking-widest text-[color:var(--color-text-muted)]"
      >
        <span className="text-[color:var(--color-accent)]">##</span> {heading}
      </h2>
      {isSingle ? (
        renderImage(items[0], 0)
      ) : (
        <div className="grid gap-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => renderImage(item, index))}
        </div>
      )}
    </section>
  )
}
