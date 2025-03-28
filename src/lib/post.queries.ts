import { db } from "@/lib/db"
import type { PostWithAuthor } from "@/types"

export async function getAllPublishedPosts(): Promise<PostWithAuthor[]> {
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
  }) as Promise<PostWithAuthor[]>
}

export async function getPostBySlug(slug: string) {
  return db.post.findUnique({
    where: { slug, published: true },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })
}

export async function getAllPostsForAdmin() {
  return db.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
  })
}

export async function getPostById(id: string) {
  return db.post.findUnique({
    where: { id },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  })
}

export async function getAllPublishedSlugs(): Promise<{ slug: string }[]> {
  return db.post.findMany({
    where: { published: true },
    select: { slug: true },
  })
}

export async function getRecentPublishedPosts(count: number) {
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: count,
    select: {
      id: true,
      title: true,
      slug: true,
      headerImage: true,
    },
  })
}
