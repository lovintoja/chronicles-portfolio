"use client"

import { Linkedin } from "lucide-react"

export default function LinkedInButton() {
  return (
    <a
      href="https://linkedin.com/in/filip-dumanowski-211a36231"
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-btn"
    >
      <Linkedin size={16} strokeWidth={2.5} aria-hidden="true" />
      Connect on LinkedIn
    </a>
  )
}
