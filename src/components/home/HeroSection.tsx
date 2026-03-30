"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/LanguageContext"

export default function HeroSection() {
  const { t } = useLanguage()

  return (
    <section className="w-full bg-pop-black neo-border border-l-0 border-r-0 border-t-0">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase text-electric-blue font-bold mb-4"
              style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
            >
              {t.hero.role}
            </p>
            <h1
              className="font-black uppercase leading-none text-5xl sm:text-7xl lg:text-8xl mb-2"
              style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
            >
              <span className="site-logo" style={{ fontSize: "inherit", letterSpacing: "-0.03em" }}>Filip</span>
              <br />
              <span className="text-pop-white" style={{ WebkitTextStroke: "2px #FF2D9B" }}>Dumanowski</span>
            </h1>
            <p
              className="text-white/70 text-lg sm:text-xl mt-6 mb-8 max-w-xl leading-snug"
              style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
            >
              {t.hero.tagline}
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#dispatches" className="btn btn-primary text-sm px-6 py-3">
                {t.hero.readBlog}
              </a>
              <Link href="/skills" className="btn btn-ghost text-sm px-6 py-3">
                {t.hero.viewSkills}
              </Link>
            </div>
          </div>

          {/* Decorative accent block — desktop only */}
          <div className="hidden lg:block flex-shrink-0">
            <div
              className="neo-border bg-hot-pink w-40 h-40 relative"
              style={{ boxShadow: "8px 8px 0 #B6FF00" }}
            >
              <img src="/author-photo.jpg" alt="Filip Dumanowski" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
