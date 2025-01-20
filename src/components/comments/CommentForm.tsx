"use client"

import { useActionState } from "react"
import { submitComment } from "@/app/actions/comment.actions"

interface CommentFormProps {
  postId: string
  postSlug: string
}

const initialState = { error: undefined, success: false }

export default function CommentForm({ postId, postSlug }: CommentFormProps) {
  const [state, formAction, isPending] = useActionState(submitComment, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="postId" value={postId} />
      <input type="hidden" name="postSlug" value={postSlug} />

      <div>
        <label
          htmlFor="name"
          className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
          style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          placeholder="YourName or YourName#password"
          className="w-full neo-border bg-white px-3 py-2 text-pop-black placeholder:text-vivid-purple-light focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow"
          style={{ fontFamily: "var(--font-playfair), sans-serif" }}
        />
        <p className="mt-1 text-xs text-pop-black" style={{ fontFamily: "var(--font-cormorant), sans-serif" }}>
          Add <code className="bg-pop-yellow text-pop-black px-1 font-mono">#password</code> after your name for a tripcode identifier
        </p>
      </div>

      <div>
        <label
          htmlFor="body"
          className="block text-xs tracking-widest uppercase text-vivid-purple font-bold mb-1"
          style={{ fontFamily: "var(--font-cormorant), sans-serif" }}
        >
          Comment
        </label>
        <textarea
          id="body"
          name="body"
          required
          rows={4}
          placeholder="Share your thoughts..."
          className="w-full neo-border bg-white px-3 py-2 text-pop-black placeholder:text-vivid-purple-light focus:outline-none focus:shadow-[0_0_0_3px_#00C2FF] transition-shadow resize-y"
          style={{ fontFamily: "var(--font-playfair), sans-serif" }}
        />
      </div>

      {state.error && (
        <p className="text-white text-sm neo-border bg-hot-pink px-3 py-2 font-bold">
          {state.error}
        </p>
      )}

      {state.success && (
        <p className="text-pop-black text-sm neo-border bg-lime-green px-3 py-2 font-bold">
          Your comment has been posted.
        </p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Post Comment"}
      </button>
    </form>
  )
}
