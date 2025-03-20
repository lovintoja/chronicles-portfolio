import Link from "next/link"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Access Denied",
}

export default function AuthErrorPage() {
  return (
    <main className="min-h-screen bg-pop-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <div className="dopamine-card p-10">
          <div
            className="text-4xl font-black text-hot-pink mb-2"
            style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
          >
            Access Denied
          </div>
          <div className="dopamine-divider my-4">
            <span className="text-solar-orange font-black text-lg">✦</span>
          </div>
          <p
            className="text-vivid-purple font-semibold leading-relaxed mb-6"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Your account is not authorized to access the admin area. Only the
            designated administrator may sign in.
          </p>
          <Link
            href="/"
            className="btn btn-ghost inline-flex"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  )
}
