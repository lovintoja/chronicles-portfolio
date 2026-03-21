"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { generateSlug } from "@/lib/slug"

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="neo-border bg-white p-4 min-h-[400px] flex items-center justify-center text-vivid-purple font-semibold">
      Loading editor...
    </div>
  ),
})

export default function NewPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [headerImage, setHeaderImage] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState("")
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState("")
  const slugManuallyEdited = useRef(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleTitleChange(value: string) {
    setTitle(value)
    if (!slugManuallyEdited.current) {
      setSlug(generateSlug(value))
    }
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError("")

    const data = new FormData()
    data.append("image", file)

    try {
      const res = await fetch("/api/upload", { method: "POST", body: data })
      if (!res.ok) {
        const json = await res.json() as { error?: string }
        throw new Error(json.error ?? "Upload failed")
      }
      const json = await res.json() as { url: string }
      setHeaderImage(json.url)
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsPending(true)
    setError("")

    const formData = new FormData()
    formData.append("title", title)
    formData.append("slug", slug)
    formData.append("excerpt", excerpt)
    formData.append("content", content)
    formData.append("headerImage", headerImage)

    try {
      const { createPost } = await import("@/app/actions/post.actions")
      await createPost(formData)
    } catch (err) {
      // Next.js redirect throws NEXT_REDIRECT — let it propagate
      const e = err as { digest?: string }
      if (e?.digest?.startsWith("NEXT_REDIRECT")) {
        router.push("/admin")
        return
      }
      setError(err instanceof Error ? err.message : "Failed to create post")
      setIsPending(false)
    }
  }

  return (
    <div>
      <h2
        className="text-2xl font-black text-pop-black tracking-wide mb-8"
        style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
      >
        New Post
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="title"
            className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Title *
          </label>
          <input
            id="title"
            type="text"
            required
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="w-full neo-border bg-white px-3 py-2.5 text-pop-black text-lg focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
            style={{ fontFamily: "var(--font-playfair), sans-serif" }}
            placeholder="Post title..."
          />
        </div>

        <div>
          <label
            htmlFor="slug"
            className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Slug
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => {
              slugManuallyEdited.current = true
              setSlug(e.target.value)
            }}
            className="w-full neo-border bg-white px-3 py-2 text-pop-black font-mono text-sm focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
            placeholder="auto-generated-from-title"
          />
        </div>

        <div>
          <label
            htmlFor="excerpt"
            className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Excerpt
          </label>
          <textarea
            id="excerpt"
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full neo-border bg-white px-3 py-2 text-pop-black focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow resize-y"
            style={{ fontFamily: "var(--font-playfair), sans-serif" }}
            placeholder="Brief description for post cards..."
          />
        </div>

        {/* Header Image Upload */}
        <div>
          <label
            htmlFor="headerImageInput"
            className="block text-xs tracking-widest uppercase font-bold mb-2"
            style={{ fontFamily: "var(--font-cormorant), sans-serif", color: "#FF2D9B" }}
          >
            Header Image *
          </label>
          <input
            id="headerImageInput"
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/gif,image/webp"
            onChange={handleImageChange}
            className="block w-full text-sm text-pop-black file:mr-4 file:py-2 file:px-4 file:neo-border file:bg-hot-pink file:text-white file:font-bold file:text-xs file:tracking-widest file:uppercase file:cursor-pointer hover:file:bg-hot-pink-dark transition-colors"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          />
          {isUploading && (
            <p className="text-xs text-electric-blue font-bold mt-2 tracking-wide" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
              Uploading...
            </p>
          )}
          {uploadError && (
            <p className="text-xs text-white font-bold mt-2 neo-border bg-hot-pink px-2 py-1 inline-block">{uploadError}</p>
          )}
          {headerImage && !isUploading && (
            <div className="mt-3 neo-border" style={{ boxShadow: "4px 4px 0px #FF2D9B", display: "inline-block" }}>
              <img
                src={headerImage}
                alt="Header image preview"
                className="block object-cover"
                style={{ maxHeight: "180px", width: "320px" }}
              />
            </div>
          )}
        </div>

        <div>
          <label
            className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Content *
          </label>
          <RichTextEditor onChange={setContent} />
        </div>

        {error && (
          <p className="text-white font-bold text-sm neo-border bg-hot-pink px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="btn btn-primary disabled:opacity-60">
            {isPending ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => router.push("/admin")}
            className="btn btn-ghost"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
