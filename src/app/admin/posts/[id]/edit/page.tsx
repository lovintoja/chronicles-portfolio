"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import dynamic from "next/dynamic"
import { generateSlug } from "@/lib/slug"
import Image from "next/image"

const RichTextEditor = dynamic(() => import("@/components/editor/RichTextEditor"), {
  ssr: false,
  loading: () => (
    <div className="neo-border bg-white p-4 min-h-[400px] flex items-center justify-center text-vivid-purple font-semibold">
      Loading editor...
    </div>
  ),
})

interface PostData {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  headerImage: string
}

export default function EditPostPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const [post, setPost] = useState<PostData | null>(null)
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

  useEffect(() => {
    fetch(`/api/admin/posts/${params.id}`)
      .then((r) => r.json())
      .then((data: PostData) => {
        setPost(data)
        setTitle(data.title)
        setSlug(data.slug)
        setExcerpt(data.excerpt ?? "")
        setContent(data.content)
        setHeaderImage(data.headerImage ?? "")
      })
      .catch(() => setError("Failed to load post"))
  }, [params.id])

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
      const { updatePost } = await import("@/app/actions/post.actions")
      await updatePost(params.id, formData)
    } catch (err) {
      const e = err as { digest?: string }
      if (e?.digest?.startsWith("NEXT_REDIRECT")) {
        router.push("/admin")
        return
      }
      setError(err instanceof Error ? err.message : "Failed to update post")
      setIsPending(false)
    }
  }

  if (!post && !error) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-vivid-purple font-semibold" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
          Loading post...
        </p>
      </div>
    )
  }

  return (
    <div>
      <h2
        className="text-2xl font-black text-pop-black tracking-wide mb-8"
        style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
      >
        Edit Post
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

          {headerImage && !isUploading && (
            <div className="mb-3">
              <p
                className="text-xs text-vivid-purple font-semibold mb-1 tracking-wide"
                style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
              >
                Current image:
              </p>
              <div className="neo-border" style={{ boxShadow: "4px 4px 0px #FF2D9B", display: "inline-block" }}>
                <Image
                  src={headerImage}
                  alt="Current header image"
                  width={320}
                  height={180}
                  className="block object-cover"
                  style={{ maxHeight: "180px", width: "320px" }}
                />
              </div>
            </div>
          )}

          <input
            id="headerImageInput"
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
        </div>

        <div>
          <label
            className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Content *
          </label>
          {content !== undefined && post && (
            <RichTextEditor initialContent={content} onChange={setContent} />
          )}
        </div>

        {error && (
          <p className="text-white font-bold text-sm neo-border bg-hot-pink px-3 py-2">{error}</p>
        )}

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={isPending} className="btn btn-primary disabled:opacity-60">
            {isPending ? "Saving..." : "Save Changes"}
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
