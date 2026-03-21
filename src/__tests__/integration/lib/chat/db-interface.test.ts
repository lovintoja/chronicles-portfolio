import { describe, it, expect, vi } from 'vitest'
import { testDb } from '../../../setup'

// Mock @/lib/db so the module uses the test database
vi.mock('@/lib/db', () => ({ db: testDb }))

import {
  findOrCreateChatUser,
  saveMessage,
  getConversations,
  isBlocked,
  blockUser,
  unblockUser,
  getBlockedUsers,
  chatUserExists,
} from '@/lib/chat/db-interface'

describe('findOrCreateChatUser') {
  it('should create a new user on the first call', async () => {
    await findOrCreateChatUser('user-foc-1', '1.2.3.4')
    const record = await testDb.chatUser.findUnique({ where: { id: 'user-foc-1' } })
    expect(record).not.toBeNull()
    expect(record?.ip).toBe('1.2.3.4')
  })

  it('should update the ip on a second call', async () => {
    await findOrCreateChatUser('user-foc-2', '1.1.1.1')
    await findOrCreateChatUser('user-foc-2', '2.2.2.2')
    const record = await testDb.chatUser.findUnique({ where: { id: 'user-foc-2' } })
    expect(record?.ip).toBe('2.2.2.2')
  })
}

describe('saveMessage') {
  it('should persist a message and return the correct structure', async () => {
    await findOrCreateChatUser('sender-sm', '1.0.0.1')
    await findOrCreateChatUser('recipient-sm', '1.0.0.2')

    const msg = await saveMessage({
      senderId: 'sender-sm',
      recipientId: 'recipient-sm',
      content: 'Hello!',
    })

    expect(msg.senderId).toBe('sender-sm')
    expect(msg.recipientId).toBe('recipient-sm')
    expect(msg.content).toBe('Hello!')
    expect(msg.read).toBe(false)
    expect(typeof msg.sentAt).toBe('string')
    expect(typeof msg.id).toBe('string')
  })
}

describe('getConversations') {
  it('should aggregate unread counts correctly', async () => {
    await findOrCreateChatUser('user-gc-a', '1.0.0.1')
    await findOrCreateChatUser('user-gc-b', '1.0.0.2')

    // Two unread messages from b to a
    await testDb.chatMessage.create({
      data: { senderId: 'user-gc-b', recipientId: 'user-gc-a', content: 'msg 1', read: false },
    })
    await testDb.chatMessage.create({
      data: { senderId: 'user-gc-b', recipientId: 'user-gc-a', content: 'msg 2', read: false },
    })
    // One read message from b to a
    await testDb.chatMessage.create({
      data: { senderId: 'user-gc-b', recipientId: 'user-gc-a', content: 'msg 3', read: true },
    })

    const convs = await getConversations('user-gc-a')
    expect(convs).toHaveLength(1)
    expect(convs[0].partnerId).toBe('user-gc-b')
    expect(convs[0].unreadCount).toBe(2)
  })
}

describe('isBlocked / blockUser / unblockUser') {
  it('should return false before blocking', async () => {
    await findOrCreateChatUser('blocker-1', '1.0.0.1')
    await findOrCreateChatUser('blocked-1', '1.0.0.2')
    expect(await isBlocked('blocker-1', 'blocked-1')).toBe(false)
  })

  it('should return true after blockUser', async () => {
    await findOrCreateChatUser('blocker-2', '1.0.0.1')
    await findOrCreateChatUser('blocked-2', '1.0.0.2')
    await blockUser('blocker-2', 'blocked-2')
    expect(await isBlocked('blocker-2', 'blocked-2')).toBe(true)
  })

  it('should return false after unblockUser', async () => {
    await findOrCreateChatUser('blocker-3', '1.0.0.1')
    await findOrCreateChatUser('blocked-3', '1.0.0.2')
    await blockUser('blocker-3', 'blocked-3')
    await unblockUser('blocker-3', 'blocked-3')
    expect(await isBlocked('blocker-3', 'blocked-3')).toBe(false)
  })
}

describe('getBlockedUsers') {
  it('should return an array of blocked user IDs for the given user', async () => {
    await findOrCreateChatUser('blocker-list', '1.0.0.1')
    await findOrCreateChatUser('blocked-list-a', '1.0.0.2')
    await findOrCreateChatUser('blocked-list-b', '1.0.0.3')

    await blockUser('blocker-list', 'blocked-list-a')
    await blockUser('blocker-list', 'blocked-list-b')

    const blocked = await getBlockedUsers('blocker-list')
    expect(blocked).toContain('blocked-list-a')
    expect(blocked).toContain('blocked-list-b')
    expect(blocked).toHaveLength(2)
  })
}

describe('chatUserExists') {
  it('should return true for an existing user', async () => {
    await findOrCreateChatUser('exists-yes', '1.0.0.1')
    expect(await chatUserExists('exists-yes')).toBe(true)
  })

  it('should return false for a non-existent user', async () => {
    expect(await chatUserExists('does-not-exist-xyz')).toBe(false)
  })
}
