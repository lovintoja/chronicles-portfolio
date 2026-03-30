"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, type Language, type Translations } from "@/i18n/translations"

interface LanguageContextValue {
  lang: Language
  setLang: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

interface LanguageProviderProps {
  children: ReactNode
  initialLang?: Language
}

export function LanguageProvider({ children, initialLang = "en" }: LanguageProviderProps) {
  // Initialise directly from the server-read cookie value — no flash
  const [lang, setLangState] = useState<Language>(initialLang)

  // Sync html[lang] on mount and whenever lang changes
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  function setLang(next: Language) {
    setLangState(next)
    // Persist in cookie (readable server-side → no flash on next load)
    document.cookie = `site-lang=${next}; path=/; max-age=31536000; SameSite=Lax`
    // Also keep localStorage as fallback
    localStorage.setItem("site-lang", next)
  }

  return (
    <LanguageContext.Provider value={{ lang, setLang, t: translations[lang] }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider")
  return ctx
}
