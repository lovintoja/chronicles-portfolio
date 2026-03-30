"use client"

import PostContent from "@/components/blog/PostContent"
import CommentList from "@/components/comments/CommentList"
import CommentForm from "@/components/comments/CommentForm"
import ArtDecoDivider from "@/components/ui/ArtDecoDivider"
import { useLanguage } from "@/contexts/LanguageContext"

interface Comment {
  id: string
  postId: string
  displayName: string
  tripcode: string | null
  body: string
  createdAt: Date
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  headerImage: string
  publishedAt: Date | null
  language: string | null
  author: { name: string | null } | null
}

interface PostDetailContentProps {
  post: Post
  comments: Comment[]
}

const LANGUAGE_FLAGS: Record<string, string> = { en: "🇬🇧", pl: "🇵🇱" }

export default function PostDetailContent({ post, comments }: PostDetailContentProps) {
  const { t, lang } = useLanguage()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const postLangKey = (post.language ?? "en") as "en" | "pl"
  const flag = LANGUAGE_FLAGS[post.language ?? "en"] ?? "🇬🇧"

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
      <header className="mb-8 text-center">
        {date && (
          <time
            className="text-xs tracking-widest uppercase text-electric-blue font-bold mb-3 block"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            {date}
          </time>
        )}

        {/* Language badge — always visible regardless of selected UI language */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span
            className="neo-border bg-pop-black text-white text-xs font-bold font-ui uppercase px-3 py-1 tracking-widest flex items-center gap-1.5"
          >
            <span className="text-sm">{flag}</span>
            {t.langBadge.writtenIn}: {t.postLanguage[postLangKey]}
          </span>
        </div>

        <h1
          className="text-2xl sm:text-3xl md:text-4xl font-black text-pop-black leading-tight mb-4"
          style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
        >
          {post.title}
        </h1>
        {post.excerpt && (
          <p
            className="text-lg text-vivid-purple italic"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            {post.excerpt}
          </p>
        )}
        {post.author?.name && (
          <p
            className="text-sm text-solar-orange font-semibold mt-3"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            {t.post.by} {post.author.name}
          </p>
        )}
      </header>

      {post.headerImage && post.headerImage.trim() !== "" && (
        <div className="neo-border mb-8 overflow-hidden" style={{ boxShadow: "5px 5px 0 #FF2D9B" }}>
          <img
            src={post.headerImage}
            alt={post.title}
            className="w-full object-cover max-h-[480px]"
          />
        </div>
      )}

      <ArtDecoDivider className="mb-8" />

      <div className="dopamine-card p-4 sm:p-6 md:p-8 mb-8 sm:mb-12">
        <PostContent html={post.content} />
      </div>

      <ArtDecoDivider className="mb-8" />

      <section>
        <h2
          className="text-xl font-black text-pop-black tracking-wide mb-6"
          style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
        >
          {t.post.comments} ({comments.length})
        </h2>

        <div className="mb-8">
          <CommentList comments={comments} />
        </div>

        <ArtDecoDivider className="mb-6" />

        <div>
          <h3
            className="text-sm tracking-widest uppercase text-vivid-purple font-bold mb-4"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            {t.post.leaveComment}
          </h3>
          <CommentForm postId={post.id} postSlug={post.slug} />
        </div>
      </section>
    </main>
  )
}
