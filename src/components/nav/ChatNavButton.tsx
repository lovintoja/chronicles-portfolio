"use client"

import { useChatContext } from "@/components/chat/ChatProvider"

export default function ChatNavButton() {
  const { openPanel, totalUnread } = useChatContext()

  return (
    <button
      onClick={openPanel}
      className="site-nav-link flex items-center gap-0.5"
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
      aria-label={`Chat${totalUnread > 0 ? ` (${totalUnread} unread)` : ""}`}
    >
      Chat
      {totalUnread > 0 && (
        <span className="chat-nav-badge">{totalUnread > 99 ? "99+" : totalUnread}</span>
      )}
    </button>
  )
}
