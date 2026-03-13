import { db } from '@/lib/db'
import type { ChatMessage, Conversation } from './types'

// Map a Prisma ChatMessage record to the ChatMessage interface from types.ts
function mapMessage(record: {
  id: string
  senderId: string
  recipientId: string
  content: string
  sentAt: Date
  read: boolean
}): ChatMessage {
  return {
    id: record.id,
    senderId: record.senderId,
    recipientId: record.recipientId,
    content: record.content,
    sentAt: record.sentAt.toISOString(),
    read: record.read,
  }
}

export async function findOrCreateChatUser(chatId: string, ip: string): Promise<void> {
  await db.chatUser.upsert({
    where: { id: chatId },
    create: { id: chatId, ip },
    update: { ip, lastSeen: new Date() },
  })
}

export async function saveMessage(msg: {
  senderId: string
  recipientId: string
  content: string
}): Promise<ChatMessage> {
  const record = await db.chatMessage.create({
    data: {
      senderId: msg.senderId,
      recipientId: msg.recipientId,
      content: msg.content,
    },
  })
  return mapMessage(record)
}

export async function getConversations(chatId: string): Promise<Conversation[]> {
  const messages = await db.chatMessage.findMany({
    where: {
      OR: [{ senderId: chatId }, { recipientId: chatId }],
    },
    orderBy: { sentAt: 'desc' },
  })

  // Build a Map keyed by partnerId. First occurrence = lastMessage (most recent).
  // Also accumulate unread counts for messages addressed to chatId.
  const partnerMap = new Map<
    string,
    { lastMessage: ChatMessage; unreadCount: number }
  >()

  for (const msg of messages) {
    const partnerId = msg.senderId === chatId ? msg.recipientId : msg.senderId

    if (!partnerMap.has(partnerId)) {
      partnerMap.set(partnerId, {
        lastMessage: mapMessage(msg),
        unreadCount: 0,
      })
    }

    // Count unread messages where the current user is the recipient
    if (msg.recipientId === chatId && !msg.read) {
      const entry = partnerMap.get(partnerId)!
      entry.unreadCount += 1
    }
  }

  return Array.from(partnerMap.entries()).map(([partnerId, data]) => ({
    partnerId,
    lastMessage: data.lastMessage,
    unreadCount: data.unreadCount,
  }))
}

export async function getMessagesWith(
  chatId: string,
  partnerId: string,
  limit = 50
): Promise<ChatMessage[]> {
  const records = await db.chatMessage.findMany({
    where: {
      OR: [
        { senderId: chatId, recipientId: partnerId },
        { senderId: partnerId, recipientId: chatId },
      ],
    },
    orderBy: { sentAt: 'asc' },
    take: limit,
  })
  return records.map(mapMessage)
}

export async function markMessagesRead(chatId: string, partnerId: string): Promise<void> {
  await db.chatMessage.updateMany({
    where: {
      recipientId: chatId,
      senderId: partnerId,
      read: false,
    },
    data: { read: true },
  })
}

export async function isBlocked(blockerId: string, blockedId: string): Promise<boolean> {
  const record = await db.chatBlock.findUnique({
    where: { blockerId_blockedId: { blockerId, blockedId } },
  })
  return record !== null
}

export async function blockUser(blockerId: string, targetId: string): Promise<void> {
  await db.chatBlock.upsert({
    where: { blockerId_blockedId: { blockerId, blockedId: targetId } },
    create: { blockerId, blockedId: targetId },
    update: {},
  })
}

export async function unblockUser(blockerId: string, targetId: string): Promise<void> {
  await db.chatBlock.deleteMany({
    where: { blockerId, blockedId: targetId },
  })
}

export async function getBlockedUsers(chatId: string): Promise<string[]> {
  const records = await db.chatBlock.findMany({
    where: { blockerId: chatId },
    select: { blockedId: true },
  })
  return records.map((r) => r.blockedId)
}

export async function chatUserExists(chatId: string): Promise<boolean> {
  const record = await db.chatUser.findUnique({
    where: { id: chatId },
    select: { id: true },
  })
  return record !== null
}

export async function updateLastSeen(chatId: string): Promise<void> {
  try {
    await db.chatUser.update({
      where: { id: chatId },
      data: { lastSeen: new Date() },
    })
  } catch {
    // User may not exist yet — silently ignore
  }
}
