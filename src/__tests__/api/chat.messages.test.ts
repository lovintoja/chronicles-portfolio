import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/chat/identity', () => ({
  getChatIdFromRequest: vi.fn(),
  CHAT_COOKIE: 'chat_uid',
}))

vi.mock('@/lib/chat/db-interface', () => ({
  chatUserExists: vi.fn(),
  isBlocked: vi.fn(),
  saveMessage: vi.fn(),
  updateLastSeen: vi.fn(),
}))

vi.mock('@/lib/chat/sse-manager', () => ({
  sendToUser: vi.fn(),
}))

import { POST } from '../../app/api/chat/messages/route'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import {
  chatUserExists,
  isBlocked,
  saveMessage,
  updateLastSeen,
} from '@/lib/chat/db-interface'

const mockGetChatId = vi.mocked(getChatIdFromRequest)
const mockChatUserExists = vi.mocked(chatUserExists)
const mockIsBlocked = vi.mocked(isBlocked)
const mockSaveMessage = vi.mocked(saveMessage)
const mockUpdateLastSeen = vi.mocked(updateLastSeen)

function makeRequest(body: unknown, chatId?: string): NextRequest {
  const req = new NextRequest('http://localhost/api/chat/messages', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return req
}

const fakeMessage = {
  id: 'msg_1',
  senderId: 'user_sender',
  recipientId: 'user_recipient',
  content: 'Hello!',
  sentAt: new Date().toISOString(),
  read: false,
}

describe('POST /api/chat/messages', () => {
  beforeEach(() => {
    mockGetChatId.mockReturnValue('user_sender')
    mockChatUserExists.mockResolvedValue(true)
    mockIsBlocked.mockResolvedValue(false)
    mockSaveMessage.mockResolvedValue(fakeMessage)
    mockUpdateLastSeen.mockResolvedValue(undefined)
  })

  describe('when request has no chat cookie (unauthenticated)', () => {
    it('should return 401', async () => {
      mockGetChatId.mockReturnValueOnce(undefined)
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hi' })
      const res = await POST(req)
      expect(res.status).toBe(401)
    })
  })

  describe('when recipientId is missing', () => {
    it('should return 400', async () => {
      const req = makeRequest({ content: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/recipientId/i)
    })
  })

  describe('when content is missing', () => {
    it('should return 400', async () => {
      const req = makeRequest({ recipientId: 'user_recipient' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/content/i)
    })
  })

  describe('when recipientId is present but empty string', () => {
    it('should return 400', async () => {
      const req = makeRequest({ recipientId: '   ', content: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when content is empty string', () => {
    it('should return 400', async () => {
      const req = makeRequest({ recipientId: 'user_recipient', content: '   ' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when content exceeds 2000 characters', () => {
    it('should return 400', async () => {
      const req = makeRequest({
        recipientId: 'user_recipient',
        content: 'a'.repeat(2001),
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/2000/i)
    })
  })

  describe('when sender and recipient are the same', () => {
    it('should return 400', async () => {
      const req = makeRequest({ recipientId: 'user_sender', content: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/yourself/i)
    })
  })

  describe('when recipient does not exist', () => {
    it('should return 404', async () => {
      mockChatUserExists.mockResolvedValueOnce(false)
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(404)
    })
  })

  describe('when sender is blocked by recipient', () => {
    it('should return 200 with delivered: false without revealing the block', async () => {
      mockIsBlocked.mockResolvedValueOnce(true)
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { delivered: boolean }
      expect(json.delivered).toBe(false)
      // Message should not be saved when blocked
      expect(mockSaveMessage).not.toHaveBeenCalled()
    })
  })

  describe('when message is valid and recipient is not blocking sender', () => {
    it('should return 200 with delivered: true and the message', async () => {
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hello!' })
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { delivered: boolean; message: typeof fakeMessage }
      expect(json.delivered).toBe(true)
      expect(json.message).toBeDefined()
      expect(json.message.content).toBe('Hello!')
    })

    it('should call saveMessage with correct parameters', async () => {
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hello!' })
      await POST(req)
      expect(mockSaveMessage).toHaveBeenCalledWith({
        senderId: 'user_sender',
        recipientId: 'user_recipient',
        content: 'Hello!',
      })
    })

    it('should call updateLastSeen for the sender', async () => {
      const req = makeRequest({ recipientId: 'user_recipient', content: 'Hello!' })
      await POST(req)
      expect(mockUpdateLastSeen).toHaveBeenCalledWith('user_sender')
    })
  })

  describe('when request body is invalid JSON', () => {
    it('should return 400', async () => {
      const req = new NextRequest('http://localhost/api/chat/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not valid json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })
})
