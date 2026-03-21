import Link from "next/link"
import { PenLine } from "lucide-react"
import ChatNavButton from "@/components/nav/ChatNavButton"

export default function SiteHeader() {
  return (
    <header className="w-full bg-pop-black neo-border border-l-0 border-r-0 border-t-0">
      <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="site-logo">The Chronicle</span>
        </Link>
        <nav className="flex items-center gap-4">
          <Link href="/about" className="site-nav-link">
            About
          </Link>
          <Link href="/skills" className="site-nav-link">
            Skills
          </Link>
          <Link href="/contact" className="site-nav-link">
            Contact
          </Link>
          <ChatNavButton />
          <Link href="/admin" className="site-nav-admin">
            <PenLine className="h-3.5 w-3.5" />
            Admin
          </Link>
        </nav>
      </div>
    </header>
  )
}
