import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { getPostBySlug, getAllPublishedSlugs } from "@/lib/post.queries"
import { getCommentsByPostId } from "@/lib/comment.queries"
import PostDetailContent from "@/components/blog/PostDetailContent"

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

  return <PostDetailContent post={post} comments={allComments} />
}
