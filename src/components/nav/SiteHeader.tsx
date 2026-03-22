"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenLine, Menu, X } from "lucide-react"
import ChatNavButton from "@/components/nav/ChatNavButton"

const navLinks = [
  { href: "/about", label: "About" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
]

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 w-full bg-pop-black transition-shadow duration-200 ${
        scrolled
          ? "border-b-4 border-[#FF2D9B] shadow-[0_4px_0_0_#FF2D9B]"
          : "neo-border border-l-0 border-r-0 border-t-0"
      }`}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <span className="site-logo">The Chronicle</span>
        </Link>

        {/* Desktop nav — hidden below md */}
        <nav className="hidden md:flex items-center gap-4">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`site-nav-link${pathname === href ? " site-nav-link--active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <ChatNavButton />
          <Link href="/admin" className="site-nav-admin flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>

        {/* Mobile right side: chat button + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ChatNavButton />
          <button
            onClick={() => setOpen(v => !v)}
            className="neo-border bg-hot-pink text-white p-2"
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown nav */}
      {open && (
        <nav className="md:hidden bg-pop-black border-t-4 border-hot-pink px-4 pb-4 flex flex-col gap-1">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`site-nav-link block py-3 border-b-2 border-white/10${pathname === href ? " site-nav-link--active" : ""}`}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="site-nav-admin inline-flex items-center gap-2 mt-2 self-start"
          >
            <PenLine className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
