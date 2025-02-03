import Link from "next/link"
import type { PostCardProps } from "@/types"

export default function PostCard({ post }: PostCardProps) {
  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

  return (
    <article className="dopamine-card p-6 hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform duration-150">
      <div className="mb-3">
        {date && (
          <time className="post-card__date text-xs tracking-widest uppercase text-electric-blue font-bold">
            {date}
          </time>
        )}
      </div>
      <Link href={`/blog/${post.slug}`}>
        <h2 className="post-card__title text-2xl font-black text-pop-black hover:text-hot-pink transition-colors mb-2 leading-tight">
          {post.title}
        </h2>
      </Link>
      {post.excerpt && (
        <p className="text-pop-black leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
      )}
      <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-pop-black">
        {post.author?.name && (
          <span className="post-card__author text-xs text-vivid-purple font-semibold tracking-wide">
            By {post.author.name}
          </span>
        )}
        <div className="flex items-center gap-4">
          {post._count && (
            <span className="post-card__comment-count text-xs text-pop-black font-medium">
              {post._count.comments} comment{post._count.comments !== 1 ? "s" : ""}
            </span>
          )}
          <Link
            href={`/blog/${post.slug}`}
            className="post-card__read-more text-xs tracking-widest uppercase text-hot-pink hover:text-hot-pink-dark font-bold transition-colors"
          >
            Read More →
          </Link>
        </div>
      </div>
    </article>
  )
}
