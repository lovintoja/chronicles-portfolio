export interface ChatIdentity {
  chatId: string
  ip: string
}

export interface ChatMessage {
  id: string
  senderId: string
  recipientId: string
  content: string
  sentAt: string   // ISO string
  read: boolean
}

export interface Conversation {
  partnerId: string
  lastMessage: ChatMessage
  unreadCount: number
}

export interface SSEEvent {
  type: 'message' | 'connected' | 'read' | 'error'
  data: unknown
}
