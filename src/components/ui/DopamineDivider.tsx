interface DopamineDividerProps {
  className?: string
  label?: string
}

export default function DopamineDivider({ className = "", label }: DopamineDividerProps) {
  return (
    <div className={`dopamine-divider ${className}`}>
      <span className="font-bold text-sm tracking-widest uppercase">
        {label ?? "✦"}
      </span>
    </div>
  )
}
