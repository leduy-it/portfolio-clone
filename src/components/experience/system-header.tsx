interface SystemHeaderProps {
  count?: number
  checksum?: string
}

export function SystemHeader({ count = 7, checksum = '0x1A4A' }: SystemHeaderProps) {
  return (
    <div className="flex items-center gap-1 font-mono text-xs tracking-wider">
      <span className="text-green-400">●</span>
      <span className="text-[color:var(--color-text-muted)]">
        SYSTEM: DEX_ENTRIES_LOADED
        <span className="mx-1 text-[color:var(--color-border-muted)]">|</span>
        COUNT: {count}
        <span className="mx-1 text-[color:var(--color-border-muted)]">|</span>
        STATUS: VERIFIED
        <span className="mx-1 text-[color:var(--color-border-muted)]">|</span>
        CHECKSUM: {checksum}
      </span>
    </div>
  )
}
