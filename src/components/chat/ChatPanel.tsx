"use client"

import { useChatContext } from "@/components/chat/ChatProvider"
import OnlineUserList from "@/components/chat/OnlineUserList"
import MessageWindow from "@/components/chat/MessageWindow"

export default function ChatPanel() {
  const { isPanelOpen, isConnected, closePanel } = useChatContext()

  return (
    <div className={`chat-panel ${isPanelOpen ? "chat-panel--open" : ""}`}>
      <div className="chat-panel__header">
        <span className="chat-panel__title">💬 Live Chat</span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isConnected ? "#B6FF00" : "#888888",
              border: "2px solid #111111",
              display: "inline-block",
              flexShrink: 0,
            }}
            aria-label={isConnected ? "Connected" : "Disconnected"}
          />
          <button
            className="chat-panel__close"
            onClick={closePanel}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>
      </div>
      <div className="chat-panel__body">
        <OnlineUserList />
        <MessageWindow />
      </div>
    </div>
  )
}
