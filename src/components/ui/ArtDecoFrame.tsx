interface ArtDecoFrameProps {
  children: React.ReactNode
  className?: string
}

export default function ArtDecoFrame({ children, className = "" }: ArtDecoFrameProps) {
  return (
    <div className={`dopamine-card p-6 ${className}`}>
      {children}
    </div>
  )
}
