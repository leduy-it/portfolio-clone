interface PixelDividerProps {
  className?: string
}

export function PixelDivider({ className = '' }: PixelDividerProps) {
  return (
    <div
      aria-hidden="true"
      className={[
        'h-1 w-full bg-[length:8px_8px] bg-[linear-gradient(90deg,rgb(var(--accent))_50%,transparent_50%)] bg-repeat-x',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    />
  )
}
