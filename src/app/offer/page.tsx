"use client"

import Link from "next/link"
import { Server, Zap, Monitor, Lightbulb } from "lucide-react"
import DopamineDivider from "@/components/ui/DopamineDivider"
import { useLanguage } from "@/contexts/LanguageContext"

const services = [
  {
    key: "saas" as const,
    icon: Server,
    accent: "#FF2D9B",
    shadow: "6px 6px 0 #00C2FF",
  },
  {
    key: "automation" as const,
    icon: Zap,
    accent: "#B6FF00",
    shadow: "6px 6px 0 #FF2D9B",
  },
  {
    key: "websites" as const,
    icon: Monitor,
    accent: "#00C2FF",
    shadow: "6px 6px 0 #B6FF00",
  },
  {
    key: "custom" as const,
    icon: Lightbulb,
    accent: "#A020F0",
    shadow: "6px 6px 0 #FFE600",
  },
]

export default function OfferPage() {
  const { t } = useLanguage()

  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <p className="section-label mb-4">{t.offer.pageLabel}</p>
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl font-black"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF2D9B 0%, #A020F0 50%, #00C2FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t.offer.heading}
        </h1>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <DopamineDivider className="mb-8 sm:mb-10" />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map(({ key, icon: Icon, accent, shadow }) => (
            <div
              key={key}
              className="dopamine-card p-6 sm:p-8 flex flex-col gap-4"
              style={{ boxShadow: shadow }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="neo-border w-10 h-10 flex items-center justify-center flex-shrink-0"
                  style={{ background: accent }}
                >
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h2
                  className="font-display text-xl sm:text-2xl font-black text-pop-black"
                  style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
                >
                  {t.offer[key].title}
                </h2>
              </div>
              <p className="font-body text-pop-black leading-relaxed">
                {t.offer[key].body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 sm:mt-14 text-center">
          <Link
            href="/contact"
            className="btn btn-primary text-base px-8 py-3"
          >
            {t.offer.cta}
          </Link>
        </div>
      </section>
    </main>
  )
}
