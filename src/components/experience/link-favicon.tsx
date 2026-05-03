import Image from 'next/image'

export type ExperienceLinkKind = 'official' | 'linkedin' | 'github' | 'other'

interface LinkFaviconProps {
  kind?: ExperienceLinkKind
  host?: string
}

const iconFrame =
  'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border bg-[color:var(--color-surface-overlay)] transition-colors duration-200'

function GlobeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.35" />
      <path
        d="M2 9h14M9 2c-1.65 2.15-2.55 4.45-2.55 7S7.35 13.85 9 16M9 2c1.65 2.15 2.55 4.45 2.55 7S10.65 13.85 9 16"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <rect x="2" y="2" width="14" height="14" rx="2.5" fill="currentColor" />
      <path
        d="M5.5 7.6H7.3V13H5.5V7.6ZM6.4 5C7 5 7.45 5.4 7.45 5.95C7.45 6.5 7 6.9 6.4 6.9C5.8 6.9 5.35 6.5 5.35 5.95C5.35 5.4 5.8 5 6.4 5ZM8.4 7.6H10.1V8.34C10.36 7.9 10.98 7.46 11.86 7.46C13.2 7.46 13.7 8.33 13.7 9.92V13H11.9V10.25C11.9 9.5 11.66 9.05 11.02 9.05C10.34 9.05 10.2 9.58 10.2 10.25V13H8.4V7.6Z"
        fill="rgb(var(--surface-card))"
      />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" aria-hidden="true">
      <path
        d="M9.5 2.1A7.4 7.4 0 0 0 7.16 16.52c.37.07.5-.16.5-.35v-1.28c-2.05.45-2.48-.99-2.48-.99-.34-.85-.82-1.08-.82-1.08-.67-.46.05-.45.05-.45.74.05 1.13.76 1.13.76.66 1.13 1.73.8 2.15.61.07-.48.26-.8.47-.99-1.64-.19-3.36-.82-3.36-3.65 0-.81.29-1.47.76-1.99-.08-.19-.33-.94.07-1.96 0 0 .62-.2 2.03.76a7.02 7.02 0 0 1 3.69 0c1.41-.96 2.03-.76 2.03-.76.4 1.02.15 1.77.07 1.96.47.52.76 1.18.76 1.99 0 2.84-1.73 3.46-3.37 3.65.27.23.5.68.5 1.37v2.04c0 .19.13.42.51.35A7.4 7.4 0 0 0 9.5 2.1Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" aria-hidden="true">
      <path
        d="M6.9 10.1 10.1 6.9M7.7 4.65 8.95 3.4a3 3 0 1 1 4.25 4.25l-1.25 1.25M9.3 12.35 8.05 13.6A3 3 0 0 1 3.8 9.35L5.05 8.1"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.35"
      />
    </svg>
  )
}

export function LinkFavicon({ kind = 'other', host }: LinkFaviconProps) {
  if (kind === 'official') {
    return (
      <span
        className={`${iconFrame} border-[color:var(--color-accent)]/25 text-[color:var(--color-accent)] ring-1 ring-[color:var(--color-accent)]/25`}
      >
        <GlobeIcon />
      </span>
    )
  }

  if (kind === 'linkedin') {
    return (
      <span
        className={`${iconFrame} border-[#0A66C2]/40 text-[#0A66C2] ring-1 ring-[#0A66C2]/30 group-hover:border-[#0A66C2] group-hover:ring-[#0A66C2]/50`}
      >
        <LinkedInIcon />
      </span>
    )
  }

  if (kind === 'github') {
    return (
      <span
        className={`${iconFrame} border-[color:var(--color-border)] text-[color:var(--color-text-muted)] group-hover:text-[color:var(--color-text-primary)]`}
      >
        <GitHubIcon />
      </span>
    )
  }

  if (host) {
    return (
      <span className={`${iconFrame} overflow-hidden border-[color:var(--color-border)]`}>
        <Image
          src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`}
          alt=""
          width={20}
          height={20}
          className="h-5 w-5 rounded-sm"
          unoptimized
        />
      </span>
    )
  }

  return (
    <span
      className={`${iconFrame} border-[color:var(--color-border)] text-[color:var(--color-text-muted)]`}
    >
      <LinkIcon />
    </span>
  )
}
