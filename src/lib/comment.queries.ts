import { db } from "@/lib/db"

export async function getCommentsByPostId(postId: string) {
  return db.comment.findMany({
    where: { postId },
    orderBy: { createdAt: "asc" },
  })
}
