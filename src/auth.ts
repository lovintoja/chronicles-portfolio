import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "@/lib/db"
import { authConfig } from "@/auth.config"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ user, profile }) {
      const githubLogin = (profile as { login?: string } | undefined)?.login
      const allowedEmail = process.env.ADMIN_EMAIL
      const allowedLogin = process.env.ADMIN_GITHUB_LOGIN

      const emailMatch = allowedEmail && user.email === allowedEmail
      const loginMatch = allowedLogin && githubLogin === allowedLogin

      if (!emailMatch && !loginMatch) {
        return "/auth/error?error=AccessDenied"
      }
      return true
    },
    async jwt({ token, user }) {
      if (user) token.id = user.id
      return token
    },
    async session({ session, token }) {
      if (token.id) session.user.id = token.id as string
      return session
    },
  },
})
