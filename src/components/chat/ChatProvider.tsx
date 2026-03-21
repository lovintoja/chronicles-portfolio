"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react"
import type { ChatMessage, Conversation, SSEEvent } from "@/lib/chat/types"
import ChatPanel from "@/components/chat/ChatPanel"

interface ChatContextValue {
  chatId: string | null
  isConnected: boolean
  isPanelOpen: boolean
  selectedPartnerId: string | null
  onlineUserIds: string[]
  conversations: Conversation[]
  messages: Record<string, ChatMessage[]>
  totalUnread: number
  openPanel: () => void
  closePanel: () => void
  selectPartner: (partnerId: string) => void
  sendMessage: (content: string) => Promise<void>
  blockUser: (userId: string) => Promise<void>
}

export const ChatContext = createContext<ChatContextValue | null>(null)

export function useChatContext(): ChatContextValue {
  const ctx = useContext(ChatContext)
  if (!ctx) throw new Error("useChatContext must be used within ChatProvider")
  return ctx
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [chatId, setChatId] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [selectedPartnerId, setSelectedPartnerId] = useState<string | null>(null)
  const [onlineUserIds, setOnlineUserIds] = useState<string[]>([])
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>({})

  const selectedPartnerRef = useRef<string | null>(null)
  const isPanelOpenRef = useRef(false)

  useEffect(() => {
    selectedPartnerRef.current = selectedPartnerId
  }, [selectedPartnerId])

  useEffect(() => {
    isPanelOpenRef.current = isPanelOpen
  }, [isPanelOpen])

  // Identity + initial data fetch
  useEffect(() => {
    async function init() {
      try {
        const identityRes = await fetch("/api/chat/identity")
        if (identityRes.ok) {
          const identityData = await identityRes.json() as { chatId: string }
          setChatId(identityData.chatId)
        }
      } catch (err) {
        console.error("Failed to fetch chat identity:", err)
      }

      try {
        const convsRes = await fetch("/api/chat/conversations")
        if (convsRes.ok) {
          const convsData = await convsRes.json() as Conversation[]
          setConversations(convsData)
        }
      } catch (err) {
        console.error("Failed to fetch conversations:", err)
      }

      try {
        const usersRes = await fetch("/api/chat/active-users")
        if (usersRes.ok) {
          const usersData = await usersRes.json() as { userIds: string[] }
          setOnlineUserIds(usersData.userIds)
        }
      } catch (err) {
        console.error("Failed to fetch active users:", err)
      }
    }

    void init()
  }, [])

  const handleSSEEvent = useCallback(
    (event: SSEEvent) => {
      if (event.type === "connected") {
        setIsConnected(true)
        return
      }

      if (event.type === "message") {
        const msg = event.data as ChatMessage
        const partnerId =
          msg.senderId === chatId ? msg.recipientId : msg.senderId

        setMessages((prev) => ({
          ...prev,
          [partnerId]: [...(prev[partnerId] ?? []), msg],
        }))

        if (
          selectedPartnerRef.current !== partnerId ||
          !isPanelOpenRef.current
        ) {
          setConversations((prev) => {
            const existing = prev.find((c) => c.partnerId === partnerId)
            if (existing) {
              return prev.map((c: Conversation) =>
                c.partnerId === partnerId
                  ? { ...c, unreadCount: c.unreadCount + 1, lastMessage: msg }
                  : c
              )
            }
            return [...prev, { partnerId, lastMessage: msg, unreadCount: 1 }]
          })
        }
      }
    },
    [chatId]
  )

  // SSE effect
  useEffect(() => {
    if (!chatId) return

    const source = new EventSource("/api/chat/stream")

    source.onopen = () => {
      setIsConnected(true)
    }

    source.onerror = () => {
      setIsConnected(false)
    }

    source.onmessage = (e) => {
      try {
        const parsed = JSON.parse(e.data as string) as SSEEvent
        handleSSEEvent(parsed)
      } catch (err) {
        console.error("Failed to parse SSE event:", err)
      }
    }

    return () => {
      source.close()
    }
  }, [chatId, handleSSEEvent])

  // Active users polling
  useEffect(() => {
    if (!chatId) return

    async function fetchActiveUsers() {
      try {
        const res = await fetch("/api/chat/active-users")
        if (res.ok) {
          const data = await res.json() as { userIds: string[] }
          setOnlineUserIds(data.userIds)
        }
      } catch (err) {
        console.error("Failed to poll active users:", err)
      }
    }

    void fetchActiveUsers()

    const interval = setInterval(() => {
      void fetchActiveUsers()
    }, 30_000)

    return () => {
      clearInterval(interval)
    }
  }, [chatId])

  const openPanel = useCallback(() => {
    setIsPanelOpen(true)
  }, [])

  const closePanel = useCallback(() => {
    setIsPanelOpen(false)
  }, [])

  const selectPartner = useCallback(
    async (partnerId: string) => {
      setSelectedPartnerId(partnerId)
      setIsPanelOpen(true)

      setConversations((prev) =>
        prev.map((c: Conversation) =>
          c.partnerId === partnerId ? { ...c, unreadCount: 0 } : c
        )
      )

      setMessages((prev) => {
        if (prev[partnerId] && prev[partnerId].length > 0) return prev

        // Fetch messages for this partner
        fetch(`/api/chat/conversations/${partnerId}`)
          .then(async (res) => {
            if (res.ok) {
              const data = await res.json() as ChatMessage[]
              setMessages((current) => ({ ...current, [partnerId]: data }))
            }
          })
          .catch((err) => {
            console.error("Failed to fetch messages for partner:", err)
          })

        return prev
      })
    },
    []
  )

  const sendMessage = useCallback(
    async (content: string) => {
      if (!selectedPartnerId || !chatId) return

      try {
        const res = await fetch("/api/chat/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ recipientId: selectedPartnerId, content }),
        })

        if (res.ok) {
          const result = await res.json() as { delivered: boolean; message: ChatMessage }
          if (result.delivered === true) {
            setMessages((prev) => ({
              ...prev,
              [selectedPartnerId]: [
                ...(prev[selectedPartnerId] ?? []),
                result.message,
              ],
            }))
            setConversations((prev) => {
              const existing = prev.find((c) => c.partnerId === selectedPartnerId)
              if (existing) {
                return prev.map((c: Conversation) =>
                  c.partnerId === selectedPartnerId
                    ? { ...c, lastMessage: result.message }
                    : c
                )
              }
              return [
                ...prev,
                {
                  partnerId: selectedPartnerId,
                  lastMessage: result.message,
                  unreadCount: 0,
                },
              ]
            })
          }
        }
      } catch (err) {
        console.error("Failed to send message:", err)
      }
    },
    [selectedPartnerId, chatId]
  )

  const blockUser = useCallback(
    async (userId: string) => {
      try {
        const res = await fetch("/api/chat/block", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetId: userId }),
        })

        if (res.ok) {
          setOnlineUserIds((prev) => prev.filter((id) => id !== userId))
          setConversations((prev) =>
            prev.filter((c) => c.partnerId !== userId)
          )
          setSelectedPartnerId((prev) => (prev === userId ? null : prev))
        }
      } catch (err) {
        console.error("Failed to block user:", err)
      }
    },
    []
  )

  const totalUnread = conversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0
  )

  const value: ChatContextValue = {
    chatId,
    isConnected,
    isPanelOpen,
    selectedPartnerId,
    onlineUserIds,
    conversations,
    messages,
    totalUnread,
    openPanel,
    closePanel,
    selectPartner,
    sendMessage,
    blockUser,
  }

  return (
    <ChatContext.Provider value={value}>
      {children}
      <ChatPanel />
    </ChatContext.Provider>
  )
}
