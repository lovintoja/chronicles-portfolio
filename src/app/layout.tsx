import type { Metadata } from "next"
import { Space_Grotesk, Bungee } from "next/font/google"
import { cookies } from "next/headers"
import "./globals.css"
import SiteHeader from "@/components/nav/SiteHeader"
import SiteFooter from "@/components/nav/SiteFooter"
import { ChatProvider } from "@/components/chat/ChatProvider"
import { LanguageProvider } from "@/contexts/LanguageContext"
import type { Language } from "@/i18n/translations"

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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  const rawLang = cookieStore.get("site-lang")?.value
  const initialLang: Language = rawLang === "pl" ? "pl" : "en"

  return (
    <html
      lang={initialLang}
      className={`${bungee.variable} ${spaceGrotesk.variable} ${spaceGroteskUI.variable}`}
    >
      <body className="min-h-screen bg-white text-pop-black antialiased">
        <LanguageProvider initialLang={initialLang}>
          <ChatProvider>
            <SiteHeader />
            {children}
            <SiteFooter />
          </ChatProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
