"use client"

import Link from "next/link"
import type { PostCardProps } from "@/types"
import { useLanguage } from "@/contexts/LanguageContext"

export default function PostCard({ post }: PostCardProps) {
  const { t, lang } = useLanguage()

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString(lang === "pl" ? "pl-PL" : "en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  const commentCount = post._count?.comments ?? 0
  const postLang = (post as { language?: string | null }).language

  return (
    <article className="post-card-wrapper dopamine-card p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform duration-150">
      <div className="mb-3 flex items-center gap-2">
        {date && (
          <time className="post-card__date text-xs tracking-widest uppercase text-electric-blue font-bold">
            ▸ {date}
          </time>
        )}
        {postLang && (
          <span className="text-base leading-none" title={t.postLanguage[postLang as "en" | "pl"] ?? postLang}>
            {postLang === "pl" ? "🇵🇱" : "🇬🇧"}
          </span>
        )}
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h2 className="post-card__title text-2xl font-black text-pop-black hover:text-hot-pink transition-colors mb-2 leading-tight">
          {post.title}
        </h2>
      </Link>
      {post.excerpt && (
        <p className="text-pop-black leading-relaxed mb-4 line-clamp-2 sm:line-clamp-3">{post.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-pop-black">
        {post.author?.name && (
          <span className="post-card__author text-xs text-vivid-purple font-semibold tracking-wide">
            {t.postCard.by} {post.author.name}
          </span>
        )}
        <div className="flex items-center gap-4">
          {post._count !== undefined && (
            <span className="neo-border text-xs font-bold font-ui uppercase px-2 py-0.5 bg-pop-yellow text-pop-black">
              {commentCount} {commentCount === 1 ? t.postCard.reply : t.postCard.replies}
            </span>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="post-card__read-more text-xs tracking-widest uppercase text-hot-pink hover:text-hot-pink-dark font-bold transition-colors"
          >
            {t.postCard.readMore}
          </Link>
        </div>
      </div>
    </article>
  )
}
