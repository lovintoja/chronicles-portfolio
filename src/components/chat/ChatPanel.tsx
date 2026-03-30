"use client"

import { useChatContext } from "@/components/chat/ChatProvider"
import OnlineUserList from "@/components/chat/OnlineUserList"
import MessageWindow from "@/components/chat/MessageWindow"
import { useLanguage } from "@/contexts/LanguageContext"

export default function ChatPanel() {
  const { isPanelOpen, isConnected, closePanel } = useChatContext()
  const { t } = useLanguage()

  return (
    <div className={`chat-panel ${isPanelOpen ? "chat-panel--open" : ""}`}>
      <div className="chat-panel__header">
        <span className="chat-panel__title">{t.chat.title}</span>
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
            aria-label={isConnected ? t.chat.connected : t.chat.disconnected}
          />
          <button
            className="chat-panel__close"
            onClick={closePanel}
            aria-label={t.chat.closeChat}
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
