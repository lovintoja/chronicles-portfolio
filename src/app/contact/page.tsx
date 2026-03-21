"use client"

import { useState } from "react"
import { Mail, MapPin, Github, Send, Linkedin } from "lucide-react"
import LinkedInButton from "@/components/ui/LinkedInButton"
import DopamineDivider from "@/components/ui/DopamineDivider"

type Status = "idle" | "loading" | "success" | "error"

export default function ContactPage() {
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
        setErrorMsg(data.error ?? "Something went wrong. Please try again.")
        setStatus("error")
      }
    } catch {
      setErrorMsg("Something went wrong. Please try again.")
      setStatus("error")
    }
  }

  return (
    <main>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-12">
        <p className="section-label mb-4">Contact</p>
        <h1 className="font-display text-4xl md:text-5xl font-black" style={{
          backgroundImage: "linear-gradient(135deg, #FF2D9B 0%, #A020F0 50%, #00C2FF 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
        }}>
          Get In Touch
        </h1>
        <p className="font-body text-vivid-purple-light text-lg mt-3">
          Have a question, an idea, or just want to say hi? Drop me a message below.
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-6">
        <DopamineDivider className="mb-10" />
      </div>

      {/* ── Two-column content ────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

          {/* LEFT: Contact Info card */}
          <div
            className="dopamine-card p-8"
            style={{ boxShadow: "6px 6px 0 #A020F0" }}
          >
            <h2 className="font-display text-2xl font-black mb-6">Reach Out</h2>

            <ul>
              {/* LinkedIn */}
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Linkedin className="text-hot-pink h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <LinkedInButton />
              </li>

              {/* Email */}
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Mail className="text-electric-blue h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black">
                  {/* TODO: Replace with your email address */}
                  your@email.com
                </span>
              </li>

              {/* GitHub */}
              <li className="flex items-center gap-3 py-3 border-b border-gray-100">
                <Github className="text-vivid-purple h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <a
                  href="https://github.com/filipdumanowski"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black hover:text-hot-pink transition-colors"
                >
                  github.com/filipdumanowski
                  {/* TODO: Update GitHub username if needed */}
                </a>
              </li>

              {/* Location */}
              <li className="flex items-center gap-3 py-3">
                <MapPin className="text-solar-orange h-5 w-5 flex-shrink-0" aria-hidden="true" />
                <span className="font-ui font-bold uppercase tracking-widest text-sm text-pop-black">
                  {/* TODO: Add your location */}
                  Poland
                </span>
              </li>
            </ul>

            <p className="mt-6 text-sm italic font-body text-vivid-purple-light">
              I typically respond within 1&ndash;2 business days.
            </p>
          </div>

          {/* RIGHT: Message Form card */}
          <div className="dopamine-card p-8">
            <h2 className="font-display text-2xl font-black mb-6">Send a Message</h2>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {/* Name */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2"
                >
                  Your Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
                  placeholder="John Doe"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2"
                >
                  Your Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
                  placeholder="john@example.com"
                />
                <p className="text-xs font-ui text-vivid-purple mt-1">
                  I&apos;ll use this to reply to your message
                </p>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="contact-message"
                  className="block font-ui font-bold uppercase tracking-widest text-xs text-pop-black mb-2"
                >
                  Your Message
                </label>
                <textarea
                  id="contact-message"
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={5}
                  className="neo-border w-full px-4 py-3 font-body text-pop-black bg-white focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow resize-none"
                  placeholder="What's on your mind?"
                />
              </div>

              {/* Success message */}
              {status === "success" && (
                <div className="bg-lime-green text-pop-black neo-border p-4 font-ui font-bold text-sm tracking-wide">
                  ✓ Message sent! I&apos;ll get back to you soon.
                </div>
              )}

              {/* Error message */}
              {status === "error" && (
                <div className="bg-hot-pink text-white neo-border p-4 font-ui font-bold text-sm tracking-wide">
                  ✗ {errorMsg || "Something went wrong. Please try again."}
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="btn btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {status === "loading" ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

        </div>
      </section>
    </main>
  )
}
