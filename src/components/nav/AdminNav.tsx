import Link from "next/link"
import { LayoutDashboard, PenLine, LogOut } from "lucide-react"
import { signOut } from "@/auth"

export default function AdminNav() {
  return (
    <nav className="bg-pop-black border-b-4 border-hot-pink px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link
          href="/admin"
          className="flex items-center gap-1.5 text-electric-blue hover:text-lime-green transition-colors text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          Dashboard
        </Link>
        <Link
          href="/admin/posts/new"
          className="flex items-center gap-1.5 text-electric-blue hover:text-lime-green transition-colors text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
        >
          <PenLine className="h-3.5 w-3.5" />
          New Post
        </Link>
      </div>
      <form
        action={async () => {
          "use server"
          await signOut({ redirectTo: "/" })
        }}
      >
        <button
          type="submit"
          className="flex items-center gap-1.5 text-solar-orange hover:text-hot-pink transition-colors text-xs font-bold tracking-widest uppercase"
          style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign Out
        </button>
      </form>
    </nav>
  )
}
