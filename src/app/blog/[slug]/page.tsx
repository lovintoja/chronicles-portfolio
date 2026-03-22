import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPostBySlug, getAllPublishedSlugs } from "@/lib/post.queries"
import { getCommentsByPostId } from "@/lib/comment.queries"
import PostContent from "@/components/blog/PostContent"
import CommentList from "@/components/comments/CommentList"
import CommentForm from "@/components/comments/CommentForm"
import ArtDecoDivider from "@/components/ui/ArtDecoDivider"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  try {
    const slugs = await getAllPublishedSlugs()
    return slugs.map((s: { slug: string }) => ({ slug: s.slug }))
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) notFound()

  const allComments = await getCommentsByPostId(post.id)

  const date = post.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null

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
            By {post.author.name}
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
          Comments ({allComments.length})
        </h2>

        <div className="mb-8">
          <CommentList comments={allComments} />
        </div>

        <ArtDecoDivider className="mb-6" />

        <div>
          <h3
            className="text-sm tracking-widest uppercase text-vivid-purple font-bold mb-4"
            style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
          >
            Leave a Comment
          </h3>
          <CommentForm postId={post.id} postSlug={post.slug} />
        </div>
      </section>
    </main>
  )
}
