import { requireAdmin } from "@/lib/auth-utils"
import AdminNav from "@/components/nav/AdminNav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-pop-black neo-border border-l-0 border-r-0 border-t-0 px-6 py-4">
        <h1
          className="text-xl font-black gradient-pop bg-clip-text text-transparent tracking-widest uppercase"
          style={{ fontFamily: "var(--font-cinzel), sans-serif", WebkitBackgroundClip: "text" }}
        >
          The Chronicle — Admin
        </h1>
      </div>
      <AdminNav />
      <main className="max-w-5xl mx-auto px-6 py-10">{children}</main>
    </div>
  )
}
