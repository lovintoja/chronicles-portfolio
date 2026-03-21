"use client"

import { useEffect, useRef, useState } from "react"
import { useChatContext } from "@/components/chat/ChatProvider"

export default function OnlineUserList() {
  const {
    chatId,
    onlineUserIds,
    selectedPartnerId,
    conversations,
    selectPartner,
    blockUser,
  } = useChatContext()

  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement | null>(null)

  // Close context menu when clicking outside
  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        openMenuId !== null &&
        menuRef.current &&
        !menuRef.current.contains(e.target as Node)
      ) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleMouseDown)
    return () => {
      document.removeEventListener("mousedown", handleMouseDown)
    }
  }, [openMenuId])

  const otherUsers = onlineUserIds.filter((id) => id !== chatId)

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar__heading">
        ● Online ({onlineUserIds.length})
      </div>
      <div className="chat-my-id">You: {chatId ? `${chatId.slice(0, 8)}…` : "..."}</div>
      <div className="chat-sidebar__list" ref={menuRef}>
        {otherUsers.length === 0 ? (
          <div className="chat-empty-state" style={{ padding: "1rem 0.75rem" }}>
            <span className="chat-empty-state__text" style={{ fontSize: "0.65rem" }}>
              No one else online
            </span>
          </div>
        ) : (
          otherUsers.map((userId: string) => {
            const unreadForUser =
              conversations.find((c) => c.partnerId === userId)?.unreadCount ?? 0
            return (
              <div
                key={userId}
                className={`chat-user-item ${
                  selectedPartnerId === userId ? "chat-user-item--selected" : ""
                }`}
                onClick={() => {
                  void selectPartner(userId)
                  setOpenMenuId(null)
                }}
              >
                <span className="chat-online-dot" />
                <span className="chat-user-item__id" title={userId}>
                  {userId.slice(0, 8)}
                </span>
                {unreadForUser > 0 && (
                  <span className="chat-user-item__unread">{unreadForUser}</span>
                )}
                <button
                  className="chat-menu-btn"
                  onClick={(e) => {
                    e.stopPropagation()
                    setOpenMenuId(openMenuId === userId ? null : userId)
                  }}
                  aria-label="Options"
                >
                  ⋯
                </button>
                {openMenuId === userId && (
                  <div className="chat-context-menu">
                    <button
                      className="chat-context-menu__item"
                      onClick={(e) => {
                        e.stopPropagation()
                        void selectPartner(userId)
                        setOpenMenuId(null)
                      }}
                    >
                      Message
                    </button>
                    <button
                      className="chat-context-menu__item chat-context-menu__item--danger"
                      onClick={(e) => {
                        e.stopPropagation()
                        void blockUser(userId)
                        setOpenMenuId(null)
                      }}
                    >
                      Block
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
