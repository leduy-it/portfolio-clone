'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useLocale } from '@/lib/i18n'

interface SystemHeaderProps {
  count?: number
  checksum?: string
  className?: string
}

function Segment({
  label,
  value,
}: {
  label: string
  value: string | number
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[rgb(var(--border))] bg-[rgb(var(--surface-page)/0.55)] px-3 py-1">
      <span className="text-[rgb(var(--text-muted))]">{label}</span>
      <span className="text-[rgb(var(--text-primary))]">{value}</span>
    </div>
  )
}

export function SystemHeader({
  count = 7,
  checksum = '0x1A4A',
  className = '',
}: SystemHeaderProps) {
  const { t } = useLocale()
  const shouldReduceMotion = useReducedMotion()

  return (
    <div
      className={[
        'flex w-full flex-col gap-3 rounded-[22px] border border-[rgb(var(--border))] bg-[rgb(var(--surface-overlay)/0.68)] px-4 py-4 shadow-[var(--shadow-card)] backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[rgb(var(--text-muted))]">
        <motion.span
          className="text-[color:var(--color-terminal-green)]"
          animate={
            shouldReduceMotion
              ? undefined
              : {
                  opacity: [0.82, 1, 0.82],
                  scale: [1, 1.04, 1],
                  filter: [
                    'drop-shadow(0 0 0 rgba(34, 197, 94, 0))',
                    'drop-shadow(0 0 8px rgba(34, 197, 94, 0.35))',
                    'drop-shadow(0 0 0 rgba(34, 197, 94, 0))',
                  ],
                }
          }
          transition={
            shouldReduceMotion
              ? undefined
              : {
                  duration: 1.6,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }
          }
        >
          ●
        </motion.span>
        <span>{t('experience.systemHeader')}</span>
      </div>

      <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em]">
        <Segment
          label={t('experience.systemCount')}
          value={String(count).padStart(2, '0')}
        />
        <Segment
          label="STATUS"
          value={t('experience.systemStatus').replace('STATUS: ', '')}
        />
        <Segment label={t('experience.systemChecksum')} value={checksum} />
      </div>
    </div>
  )
}
