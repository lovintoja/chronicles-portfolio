import { signIn } from "@/auth"
import { Github } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign In",
}

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-pop-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <h1
            className="text-3xl font-black gradient-pop bg-clip-text text-transparent tracking-widest uppercase mb-2"
            style={{ fontFamily: "var(--font-cinzel), sans-serif", WebkitBackgroundClip: "text" }}
          >
            The Chronicle
          </h1>
          <div className="dopamine-divider my-4">
            <span className="text-xs font-black text-electric-blue tracking-widest uppercase px-2" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
              Admin Access
            </span>
          </div>
        </div>

        <div className="dopamine-card p-8">
          <p
            className="text-vivid-purple font-semibold text-center mb-6 leading-relaxed"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Sign in with your GitHub account to access the admin dashboard.
          </p>

          <form
            action={async () => {
              "use server"
              await signIn("github", { redirectTo: "/admin" })
            }}
          >
            <button
              type="submit"
              className="btn btn-primary w-full flex items-center justify-center gap-2"
            >
              <Github className="h-4 w-4" />
              Continue with GitHub
            </button>
          </form>

          <p
            className="text-xs text-vivid-purple font-semibold text-center mt-4"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Only authorized administrators may sign in.
          </p>
        </div>
      </div>
    </main>
  )
}
