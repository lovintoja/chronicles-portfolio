import { auth } from "@/auth"
import { redirect } from "next/navigation"

export async function requireAdmin() {
  const session = await auth()
  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/auth/signin")
  }
  return session
}
