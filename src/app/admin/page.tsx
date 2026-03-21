import Link from "next/link"
import { getAllPostsForAdmin } from "@/lib/post.queries"

type AdminPost = Awaited<ReturnType<typeof getAllPostsForAdmin>>[number]
import { publishPost, deletePost } from "@/app/actions/post.actions"
import { PenLine, Eye, EyeOff, Trash2, Plus } from "lucide-react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard",
}

export default async function AdminPage() {
  const posts = await getAllPostsForAdmin()

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h2
          className="text-2xl font-black text-pop-black tracking-wide"
          style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
        >
          All Posts
        </h2>
        <Link href="/admin/posts/new" className="btn btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="dopamine-card p-10 text-center">
          <PenLine className="h-10 w-10 text-hot-pink mx-auto mb-4" />
          <p className="text-vivid-purple font-semibold" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
            No posts yet. Create your first post to get started.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post: AdminPost) => (
            <div key={post.id} className="dopamine-card p-5 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span
                    className={`text-xs font-black tracking-widest uppercase px-2 py-0.5 neo-border ${
                      post.published
                        ? "bg-lime-green text-pop-black"
                        : "bg-pop-yellow text-pop-black"
                    }`}
                    style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
                  >
                    {post.published ? "Published" : "Draft"}
                  </span>
                  <time className="text-xs text-electric-blue font-semibold" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <h3
                  className="text-lg font-black text-pop-black truncate"
                  style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
                >
                  {post.title}
                </h3>
                {post.excerpt && (
                  <p className="text-pop-black text-sm mt-1 line-clamp-1">{post.excerpt}</p>
                )}
                <p className="text-xs text-vivid-purple font-semibold mt-1" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
                  {post._count?.comments ?? 0} comment{(post._count?.comments ?? 0) !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1"
                >
                  <PenLine className="h-3.5 w-3.5" />
                  Edit
                </Link>
                <form
                  action={async () => {
                    "use server"
                    await publishPost(post.id)
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-ghost text-xs px-3 py-1.5 flex items-center gap-1"
                    title={post.published ? "Unpublish" : "Publish"}
                  >
                    {post.published ? (
                      <><EyeOff className="h-3.5 w-3.5" /> Unpublish</>
                    ) : (
                      <><Eye className="h-3.5 w-3.5" /> Publish</>
                    )}
                  </button>
                </form>
                <form
                  action={async () => {
                    "use server"
                    await deletePost(post.id)
                  }}
                >
                  <button
                    type="submit"
                    className="btn btn-danger text-xs px-3 py-1.5 flex items-center gap-1"
                    title="Delete post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
