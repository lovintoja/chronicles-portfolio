"use client"

import { Linkedin } from "lucide-react"

export default function LinkedInButton() {
  return (
    <a
      href="https://www.linkedin.com/in/filipdumanowski/"
      target="_blank"
      rel="noopener noreferrer"
      className="linkedin-btn"
    >
      <Linkedin size={16} strokeWidth={2.5} aria-hidden="true" />
      Connect on LinkedIn
    </a>
  )
}
