"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import DopamineDivider from "@/components/ui/DopamineDivider"
import { useLanguage } from "@/contexts/LanguageContext"

type WebTier = "landing" | "business" | "premium"

const webTiers: { key: WebTier; shadow: string; accentBorder: string }[] = [
  { key: "landing",  shadow: "4px 4px 0 #00C2FF", accentBorder: "#00C2FF" },
  { key: "business", shadow: "4px 4px 0 #FF2D9B", accentBorder: "#FF2D9B" },
  { key: "premium",  shadow: "4px 4px 0 #A020F0", accentBorder: "#A020F0" },
]

export default function PricingPage() {
  const { t } = useLanguage()

  const featureRows: { label: string; key: keyof typeof t.pricing.web.landing }[] = [
    { label: t.pricing.purposeLabel,  key: "purpose" },
    { label: t.pricing.scopeLabel,    key: "scope" },
    { label: t.pricing.cmsLabel,      key: "cms" },
    { label: t.pricing.featuresLabel, key: "features" },
    { label: t.pricing.seoLabel,      key: "seo" },
  ]

  return (
    <main>
      {/* Page header */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <h1
          className="font-display text-3xl sm:text-4xl md:text-5xl font-black"
          style={{
            backgroundImage: "linear-gradient(135deg, #FF2D9B 0%, #A020F0 50%, #00C2FF 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {t.pricing.heading}
        </h1>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <DopamineDivider className="mb-8 sm:mb-10" />
      </div>

      {/* Websites — 3 package cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10">
        <p className="section-label mb-6">{t.pricing.websitesSection}</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {webTiers.map(({ key, shadow, accentBorder }) => {
            const pkg = t.pricing.web[key]
            return (
              <div
                key={key}
                className="dopamine-card flex flex-col"
                style={{ boxShadow: shadow }}
              >
                {/* Card header */}
                <div
                  className="px-5 py-4 neo-border border-l-0 border-r-0 border-t-0 flex items-center justify-between"
                  style={{ borderBottomColor: accentBorder }}
                >
                  <h2
                    className="font-display text-lg font-black text-pop-black"
                    style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
                  >
                    {pkg.name}
                  </h2>
                </div>

                {/* Feature rows — flex-1 pushes price/CTA to bottom */}
                <div className="flex flex-col divide-y-2 divide-pop-black/10 flex-1 justify-start">
                  {featureRows.map(({ label, key: fKey }) => (
                    <div key={fKey} className="px-5 py-3">
                      <p
                        className="text-xs font-bold uppercase tracking-widest mb-1"
                        style={{ color: accentBorder, fontFamily: "var(--font-cormorant), sans-serif" }}
                      >
                        {label}
                      </p>
                      <p className="text-sm font-body text-pop-black leading-snug">
                        {pkg[fKey]}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="px-5 py-4 border-t-2 border-pop-black/10">
                  <p
                    className="text-xs font-bold uppercase tracking-widest text-vivid-purple mb-3"
                    style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
                  >
                    {pkg.price ? `${t.pricing.fromLabel} ${pkg.price}` : t.pricing.priceEmpty}
                  </p>
                  <Link
                    href="/contact"
                    className="btn btn-primary w-full text-center text-sm py-2"
                  >
                    {t.pricing.contactCta}
                  </Link>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <DopamineDivider className="mb-8 sm:mb-10" />
      </div>

      {/* SaaS + Automation — 2 individual-quote cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* SaaS */}
          <div className="dopamine-card p-6 sm:p-8 flex flex-col gap-4" style={{ boxShadow: "6px 6px 0 #FF2D9B" }}>
            <div>
              <p className="section-label mb-1">{t.pricing.saasSection}</p>
            </div>
            <p className="font-body text-pop-black leading-relaxed text-sm">
              {t.pricing.saas.description}
            </p>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest text-vivid-purple mb-2"
                style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
              >
                {t.pricing.includesLabel}
              </p>
              <ul className="space-y-1.5">
                {t.pricing.saas.includes.map((item: string) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-body text-pop-black">
                    <Check className="h-4 w-4 text-hot-pink flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t-2 border-pop-black/10">
              <p
                className="text-xs font-bold uppercase tracking-widest text-vivid-purple mb-3"
                style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
              >
                {t.pricing.priceEmpty}
              </p>
              <Link href="/contact" className="btn btn-primary text-sm py-2 inline-block">
                {t.pricing.contactCta}
              </Link>
            </div>
          </div>

          {/* Automation */}
          <div className="dopamine-card p-6 sm:p-8 flex flex-col gap-4" style={{ boxShadow: "6px 6px 0 #B6FF00" }}>
            <div>
              <p className="section-label mb-1">{t.pricing.automationSection}</p>
            </div>
            <p className="font-body text-pop-black leading-relaxed text-sm">
              {t.pricing.automation.description}
            </p>
            <div>
              <p
                className="text-xs font-bold uppercase tracking-widest text-vivid-purple mb-2"
                style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
              >
                {t.pricing.includesLabel}
              </p>
              <ul className="space-y-1.5">
                {t.pricing.automation.includes.map((item: string) => (
                  <li key={item} className="flex items-start gap-2 text-sm font-body text-pop-black">
                    <Check className="h-4 w-4 text-lime-green flex-shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-auto pt-4 border-t-2 border-pop-black/10">
              <p
                className="text-xs font-bold uppercase tracking-widest text-vivid-purple mb-3"
                style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
              >
                {t.pricing.priceEmpty}
              </p>
              <Link href="/contact" className="btn btn-primary text-sm py-2 inline-block">
                {t.pricing.contactCta}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
