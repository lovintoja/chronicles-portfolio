"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage()

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setLang("en")}
        aria-label="Switch to English"
        title="English"
        className={`text-lg leading-none transition-all duration-150 ${
          lang === "en" ? "opacity-100 scale-110" : "opacity-40 hover:opacity-70"
        }`}
      >
        🇬🇧
      </button>
      <button
        onClick={() => setLang("pl")}
        aria-label="Przełącz na język polski"
        title="Polski"
        className={`text-lg leading-none transition-all duration-150 ${
          lang === "pl" ? "opacity-100 scale-110" : "opacity-40 hover:opacity-70"
        }`}
      >
        🇵🇱
      </button>
    </div>
  )
}
