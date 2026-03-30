"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { PenLine, Menu, X, ChevronDown } from "lucide-react"
import ChatNavButton from "@/components/nav/ChatNavButton"
import LanguageSwitcher from "@/components/nav/LanguageSwitcher"
import { useLanguage } from "@/contexts/LanguageContext"

type NavGroup = {
  label: string
  items: { href: string; label: string }[]
}

function DesktopDropdown({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const isGroupActive = group.items.some(item => pathname === item.href)

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <span
        className={`site-nav-link flex items-center gap-1 select-none${isGroupActive ? " site-nav-link--active" : ""}`}
        aria-haspopup="true"
      >
        {group.label}
        <ChevronDown
          className={`h-3 w-3 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </span>

      {open && (
        <div className="absolute top-full left-0 pt-1 min-w-[140px] z-50">
          <div className="bg-pop-black neo-border flex flex-col shadow-[4px_4px_0_0_#FF2D9B]">
            {group.items.map(item => (
              <Link
                key={item.href}
                href={item.href}
                className={`site-nav-link px-4 py-2.5 border-b border-white/10 last:border-b-0 whitespace-nowrap${pathname === item.href ? " site-nav-link--active" : ""}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeGroup, setActiveGroup] = useState<string | null>(null)
  const pathname = usePathname()
  const { t } = useLanguage()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  function toggleGroup(label: string) {
    setActiveGroup(prev => (prev === label ? null : label))
  }

  const navGroups: NavGroup[] = [
    {
      label: t.nav.info,
      items: [
        { href: "/about", label: t.nav.about },
        { href: "/skills", label: t.nav.skills },
        { href: "/contact", label: t.nav.contact },
      ],
    },
    {
      label: t.nav.services,
      items: [
        { href: "/offer", label: t.nav.offer },
        { href: "/pricing", label: t.nav.pricing },
        { href: "/projects", label: t.nav.projects },
      ],
    },
  ]

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
          {navGroups.map(group => (
            <DesktopDropdown key={group.label} group={group} pathname={pathname} />
          ))}
          <ChatNavButton />
          <LanguageSwitcher />
          <Link href="/admin" className="site-nav-admin flex items-center gap-1.5">
            <PenLine className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>

        {/* Mobile right side: chat + language + hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ChatNavButton />
          <LanguageSwitcher />
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
          {navGroups.map(group => {
            const isExpanded = activeGroup === group.label
            const isGroupActive = group.items.some(item => pathname === item.href)

            return (
              <div key={group.label}>
                <button
                  onClick={() => toggleGroup(group.label)}
                  className={`site-nav-link flex items-center justify-between w-full py-3 border-b-2 border-white/10${isGroupActive ? " site-nav-link--active" : ""}`}
                  aria-expanded={isExpanded}
                >
                  {group.label}
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform duration-150 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="flex flex-col border-b-2 border-white/10">
                    {group.items.map(item => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => { setOpen(false); setActiveGroup(null) }}
                        className={`site-nav-link block py-2.5 pl-4 border-b border-white/5 last:border-b-0${pathname === item.href ? " site-nav-link--active" : ""}`}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
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
