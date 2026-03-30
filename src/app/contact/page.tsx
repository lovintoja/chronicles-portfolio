"use client"

import { useState } from "react"
import { Mail, MapPin, Code2, Send } from "lucide-react"
import LinkedInButton from "@/components/ui/LinkedInButton"
import DopamineDivider from "@/components/ui/DopamineDivider"
import { useLanguage } from "@/contexts/LanguageContext"

type Status = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
  const { t } = useLanguage()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus("loading")
    setErrorMsg("")

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      })

      if (res.ok) {
        setStatus("success")
      } else {
        const data = await res.json().catch(() => ({}))
        setErrorMsg(data.error ?? t.contact.error)
        setStatus("error")
      }
    } catch {
      setErrorMsg(t.contact.error)
      setStatus("error")
    }
  }

  return (
    <main>
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black" style={{
          backgroundImage: "linear-gradient(135deg, #FF2D9B 0%, #A020F0 50%, #00C2FF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          {t.contact.heading}
        </h1>
        <p className="font-body text-vivid-purple-light text-lg mt-3">
          {t.contact.subheading}
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <DopamineDivider className="mb-8 sm:mb-10" />
      </div>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-10 sm:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">

          <div className="dopamine-card p-4 sm:p-6 md:p-8" style={{ boxShadow: "6px 6px 0 #A020F0" }}>
            <h2 className="font-display text-2xl font-black mb-6">{t.contact.reachOut}</h2>
            <ul>
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <LinkedInButton />
              </li>
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Mail className="text-electric-blue h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black">
                  filip.dumanowski@gmail.com
                </span>
              </li>
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Code2 className="text-vivid-purple h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <a
                  href="https://github.com/lovintoja"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black hover:text-hot-pink transition-colors"
                >
                  github.com/lovintoja
                </a>
              </li>
              <li className="flex items-center gap-3 py-3">
                <MapPin className="text-solar-orange h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black">
                  Poland
                </span>
              </li>
            </ul>
            <p className="mt-6 text-sm italic font-body text-vivid-purple-light">
              {t.contact.responseTime}
            </p>
          </div>

          <div className="dopamine-card p-4 sm:p-6 md:p-8">
            <h2 className="font-display text-xl sm:text-2xl font-black mb-6">{t.contact.sendMessage}</h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="contact-name" className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2">
                  {t.contact.yourName}
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
                  placeholder={t.contact.namePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2">
                  {t.contact.yourEmail}
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
                  placeholder={t.contact.emailPlaceholder}
                />
                <p className="text-xs font-ui text-vivid-purple mt-1">
                  {t.contact.emailHint}
                </p>
              </div>

              <div>
                <label htmlFor="contact-message" className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2">
                  {t.contact.yourMessage}
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow resize-none"
                  placeholder={t.contact.messagePlaceholder}
                />
              </div>

              {status === "success" && (
                <div className="bg-lime-green text-pop-black neo-border p-4 font-ui font-bold text-sm tracking-wide">
                  {t.contact.success}
                </div>
              )}

              {status === "error" && (
                <div className="bg-hot-pink text-white neo-border p-4 font-ui font-bold text-sm tracking-wide">
                  ✗ {errorMsg || t.contact.error}
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {status === "loading" ? t.contact.sending : t.contact.send}
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  )
}
