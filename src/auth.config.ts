import type { NextAuthConfig } from "next-auth"
import GitHub from "next-auth/providers/github"

// Edge-compatible config — no Prisma adapter, used by middleware
export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAdminRoute = request.nextUrl.pathname.startsWith("/admin")
      if (isAdminRoute && !auth?.user) return false
      return true
    },
  },
}
