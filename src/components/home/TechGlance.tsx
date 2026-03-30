"use client"

import { useLanguage } from "@/contexts/LanguageContext"

export default function TechGlance() {
  const { t } = useLanguage()

  const cards = [
    {
      accent: "#FF2D9B",
      shadow: "6px 6px 0 #00C2FF",
      label: t.techGlance.backend.label,
      title: t.techGlance.backend.title,
      body: t.techGlance.backend.body,
      pills: [".NET 8", "Java 17", "Spring Boot"],
      pillBg: "bg-hot-pink text-white",
    },
    {
      accent: "#B6FF00",
      shadow: "6px 6px 0 #FF2D9B",
      label: t.techGlance.cloud.label,
      title: t.techGlance.cloud.title,
      body: t.techGlance.cloud.body,
      pills: ["Azure", "Docker", "GitHub Actions"],
      pillBg: "bg-lime-green text-pop-black",
    },
    {
      accent: "#00C2FF",
      shadow: "6px 6px 0 #B6FF00",
      label: t.techGlance.data.label,
      title: t.techGlance.data.title,
      body: t.techGlance.data.body,
      pills: ["PostgreSQL", "SQL Server", "Prisma"],
      pillBg: "bg-electric-blue text-pop-black",
    },
  ]

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <p className="section-label mb-6">{t.techGlance.sectionLabel}</p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {cards.map((c) => (
          <div
            key={c.title}
            className="dopamine-card p-5 flex flex-col gap-3"
            style={{ boxShadow: c.shadow }}
          >
            <div className="w-8 h-8 neo-border flex-shrink-0" style={{ background: c.accent }} />
            <div>
              <p className="section-label mb-1">{c.label}</p>
              <h3
                className="text-xl font-black text-pop-black"
                style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
              >
                {c.title}
              </h3>
              <p className="text-sm text-pop-black mt-2 leading-snug">{c.body}</p>
            </div>
            <div className="flex flex-wrap gap-2 mt-auto pt-2">
              {c.pills.map((p) => (
                <span key={p} className={`neo-border text-xs font-bold font-ui uppercase px-2 py-0.5 ${c.pillBg}`}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
