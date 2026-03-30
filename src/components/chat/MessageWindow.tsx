"use client"

import { useEffect, useRef, useState } from "react"
import { useChatContext } from "@/components/chat/ChatProvider"
import { useLanguage } from "@/contexts/LanguageContext"
import type { ChatMessage } from "@/lib/chat/types"

const EMOJIS = [
  "😀","😂","🥰","😍","😊","😎","🤔","😅","😭","😤","🥺","🤣",
  "😘","🥳","😏","😒","🙄","😬","🤯","🤩","😇","🤗","😴","🤑",
  "❤️","🧡","💛","💚","💙","💜","🖤","🤍","💕","💖","💗","💓",
  "🔥","✨","🎉","👍","👎","👏","🙏","💪","🤝","✌️","🤞","👀",
  "🌈","⭐","🌙","☀️","❄️","🌊","🌸","🌺","🦋","🍀","💫","🎵",
  "🎮","💻","📱","🍕","🍔","☕","🍺","🎂","🍭","🌮","🍜","🍣",
]

export default function MessageWindow() {
  const { chatId, selectedPartnerId, messages, sendMessage } = useChatContext()
  const { t } = useLanguage()

  const [inputValue, setInputValue] = useState("")
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const currentMessages = selectedPartnerId ? (messages[selectedPartnerId] ?? []) : []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [currentMessages])

  async function handleSend() {
    const content = inputValue.trim()
    if (!content || !selectedPartnerId || isSending) return
    setIsSending(true)
    setInputValue("")
    await sendMessage(content)
    setIsSending(false)
    textareaRef.current?.focus()
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      void handleSend()
    }
  }

  if (!selectedPartnerId) {
    return (
      <div className="chat-message-window">
        <div className="chat-empty-state">
          <span className="chat-empty-state__icon">💬</span>
          <span className="chat-empty-state__text">{t.chat.selectUser}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-message-window">
      <div className="chat-window-header">
        {t.chat.chattingWith} {selectedPartnerId.slice(0, 8)}…
      </div>

      <div className="chat-message-list">
        {currentMessages.map((msg: ChatMessage) => {
          const isSent = msg.senderId === chatId
          return (
            <div
              key={msg.id}
              className={`chat-bubble ${
                isSent
                  ? "chat-bubble--sent"
                  : msg.read
                  ? "chat-bubble--received"
                  : "chat-bubble--unread"
              }`}
            >
              {msg.content}
              <div className="chat-bubble__meta">
                <span className="chat-bubble__time">
                  {new Date(msg.sentAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {isSent && (
                  <span
                    className={`chat-bubble__read-dot ${
                      msg.read
                        ? "chat-bubble__read-dot--read"
                        : "chat-bubble__read-dot--unread"
                    }`}
                  />
                )}
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        {isEmojiPickerOpen && (
          <div className="chat-emoji-picker">
            {EMOJIS.map((emoji: string) => (
              <button
                key={emoji}
                className="chat-emoji-btn"
                onClick={() => {
                  setInputValue((prev) => prev + emoji)
                }}
                type="button"
              >
                {emoji}
              </button>
            ))}
          </div>
        )}
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t.chat.placeholder}
          rows={2}
        />
        <div className="chat-input-actions">
          <button
            type="button"
            className="chat-emoji-toggle"
            onClick={() => setIsEmojiPickerOpen((prev) => !prev)}
            aria-label="Toggle emoji picker"
          >
            😊
          </button>
          <button
            type="button"
            className="chat-send-btn"
            onClick={() => void handleSend()}
            disabled={!inputValue.trim() || isSending}
          >
            {t.chat.send}
          </button>
        </div>
      </div>
    </div>
  )
}
