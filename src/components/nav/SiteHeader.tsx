"use client"

import { useState } from "react"
import Link from "next/link"
import { PenLine, Menu, X } from "lucide-react"
import ChatNavButton from "@/components/nav/ChatNavButton"

export default function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="w-full bg-pop-black neo-border border-l-0 border-r-0 border-t-0 relative z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3">
          <span className="site-logo">The Chronicle</span>
        </Link>

        {/* Desktop nav — hidden below md */}
        <nav className="hidden md:flex items-center gap-4">
          <Link href="/about" className="site-nav-link">About</Link>
          <Link href="/skills" className="site-nav-link">Skills</Link>
          <Link href="/contact" className="site-nav-link">Contact</Link>
          <ChatNavButton />
          <Link href="/admin" className="site-nav-admin">
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
          {[
            { href: "/about", label: "About" },
            { href: "/skills", label: "Skills" },
            { href: "/contact", label: "Contact" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="site-nav-link block py-3 border-b-2 border-white/10"
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
