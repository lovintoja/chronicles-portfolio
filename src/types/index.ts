import type { Post, Comment, User } from "@prisma/client"

export type { Post, Comment, User }

export interface PostWithAuthor extends Post {
  author: Pick<User, "id" | "name" | "image">
  _count?: { comments: number }
}

export interface CommentWithPost extends Comment {
  post?: Pick<Post, "id" | "slug" | "title">
}

export interface PostCardProps {
  post: PostWithAuthor
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
