interface ArtDecoDividerProps {
  className?: string
}

export default function ArtDecoDivider({ className = "" }: ArtDecoDividerProps) {
  return (
    <div className={`dopamine-divider ${className}`}>
      <span className="font-bold text-sm tracking-widest uppercase">✦</span>
    </div>
  )
}
