"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { db } from "@/lib/db"
import { requireAdmin } from "@/lib/auth-utils"
import { generateSlug } from "@/lib/slug"

export async function createPost(formData: FormData) {
  const session = await requireAdmin()

  const title = formData.get("title") as string
  const slugInput = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const headerImage = (formData.get("headerImage") as string) ?? ""

  if (!title || !content) {
    throw new Error("Title and content are required")
  }

  const slug = slugInput?.trim() || generateSlug(title)

  const post = await db.post.create({
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || null,
      content,
      headerImage: headerImage.trim(),
      authorId: session.user.id,
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  redirect(`/admin/posts/${post.id}/edit`)
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin()

  const title = formData.get("title") as string
  const slugInput = formData.get("slug") as string
  const excerpt = formData.get("excerpt") as string
  const content = formData.get("content") as string
  const headerImage = (formData.get("headerImage") as string) ?? ""

  if (!title || !content) {
    throw new Error("Title and content are required")
  }

  const slug = slugInput?.trim() || generateSlug(title)

  await db.post.update({
    where: { id },
    data: {
      title: title.trim(),
      slug,
      excerpt: excerpt?.trim() || null,
      content,
      headerImage: headerImage.trim(),
      updatedAt: new Date(),
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  redirect("/admin")
}

export async function publishPost(id: string) {
  await requireAdmin()

  const post = await db.post.findUnique({ where: { id } })
  if (!post) throw new Error("Post not found")

  await db.post.update({
    where: { id },
    data: {
      published: !post.published,
      publishedAt: !post.published ? new Date() : null,
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath(`/blog/${post.slug}`)
}

export async function deletePost(id: string) {
  await requireAdmin()

  const post = await db.post.findUnique({ where: { id } })
  if (!post) throw new Error("Post not found")

  await db.post.delete({ where: { id } })

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath(`/blog/${post.slug}`)
}
