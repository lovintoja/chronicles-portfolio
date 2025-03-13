import type { Metadata } from "next"
import { Space_Grotesk, Bungee } from "next/font/google"
import "./globals.css"
import SiteHeader from "@/components/nav/SiteHeader"

const bungee = Bungee({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-cinzel",
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
})

const spaceGroteskUI = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "The Chronicle",
    template: "%s | The Chronicle",
  },
  description: "A dopamine decor blog built with Next.js, Prisma, and NextAuth.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${bungee.variable} ${spaceGrotesk.variable} ${spaceGroteskUI.variable}`}
    >
      <body className="min-h-screen bg-white text-pop-black antialiased">
        <SiteHeader />
        {children}
      </body>
    </html>
  )
}
