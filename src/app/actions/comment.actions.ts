"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { parseNameAndTripcode } from "@/lib/tripcode"

interface CommentState {
  error?: string
  success?: boolean
}

export async function submitComment(
  prevState: CommentState,
  formData: FormData
): Promise<CommentState> {
  const postId = formData.get("postId") as string
  const postSlug = formData.get("postSlug") as string
  const nameInput = formData.get("name") as string
  const body = formData.get("body") as string

  if (!postId || !nameInput?.trim() || !body?.trim()) {
    return { error: "Name and comment body are required." }
  }

  if (body.trim().length > 2000) {
    return { error: "Comment must be under 2000 characters." }
  }

  const { displayName, tripcode } = parseNameAndTripcode(nameInput)

  await db.comment.create({
    data: {
      postId,
      displayName,
      tripcode,
      body: body.trim(),
    },
  })

  revalidatePath(`/blog/${postSlug}`)

  return { success: true }
}
