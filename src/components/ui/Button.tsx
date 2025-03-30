import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger"
  size?: "sm" | "md" | "lg"
}

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "text-xs px-3 py-1.5",
    md: "text-sm px-5 py-2.5",
    lg: "text-base px-7 py-3",
  }

  return (
    <button
      className={`btn btn-${variant} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
