"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function OfferPage() {
  const { t } = useLanguage()
  return (
    <main className="min-h-screen bg-pop-black flex flex-col items-center justify-center px-4">
      <h1 className="text-4xl font-black uppercase tracking-widest text-white mb-4">
        {t.nav.offer}
      </h1>
      <p className="text-white/50 text-lg">{t.comingSoon}</p>
    </main>
  )
}
