"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function SiteFooter() {
  const { t } = useLanguage()
  const year = new Date().getFullYear()

  return (
    <footer className="w-full bg-pop-black neo-border border-l-0 border-r-0 border-b-0 mt-16">
      <div className="max-w-5xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="font-ui text-xs uppercase tracking-widest text-electric-blue">
          &copy; {year} Filip Dumanowski &mdash; {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
