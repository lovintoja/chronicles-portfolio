import type { Comment } from "@prisma/client"
import ArtDecoDivider from "@/components/ui/ArtDecoDivider"

interface CommentListProps {
  comments: Comment[]
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function CommentList({ comments }: CommentListProps) {
  if (comments.length === 0) {
    return (
      <p className="text-vivid-purple italic text-center py-4" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
        No comments yet. Be the first to share your thoughts.
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {comments.map((comment, index) => (
        <div key={comment.id}>
          {index > 0 && <ArtDecoDivider className="my-4" />}
          <div className="neo-border neo-shadow bg-white p-4">
            <div className="flex items-baseline gap-2 mb-2">
              <span
                className="font-black text-pop-black"
                style={{ fontFamily: "var(--font-cinzel), sans-serif" }}
              >
                {comment.displayName}
              </span>
              {comment.tripcode && (
                <span className="text-sm font-mono">
                  <span className="text-hot-pink font-bold">◆</span>
                  <span className="text-hot-pink font-bold">{comment.tripcode}</span>
                </span>
              )}
              <time className="text-xs text-electric-blue font-semibold ml-auto" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
                {formatDate(comment.createdAt)}
              </time>
            </div>
            <p className="text-pop-black leading-relaxed whitespace-pre-wrap">{comment.body}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
