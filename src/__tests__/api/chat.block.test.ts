import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/chat/identity', () => ({
  getChatIdFromRequest: vi.fn(),
  CHAT_COOKIE: 'chat_uid',
}))

vi.mock('@/lib/chat/db-interface', () => ({
  blockUser: vi.fn(),
  getBlockedUsers: vi.fn(),
  unblockUser: vi.fn(),
}))

import { POST, GET } from '../../app/api/chat/block/route'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import { blockUser, getBlockedUsers } from '@/lib/chat/db-interface'

const mockGetChatId = vi.mocked(getChatIdFromRequest)
const mockBlockUser = vi.mocked(blockUser)
const mockGetBlockedUsers = vi.mocked(getBlockedUsers)

function makePostRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/chat/block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

function makeGetRequest(): NextRequest {
  return new NextRequest('http://localhost/api/chat/block', { method: 'GET' })
}

describe('POST /api/chat/block', () => {
  beforeEach(() => {
    mockGetChatId.mockReturnValue('user_blocker')
    mockBlockUser.mockResolvedValue(undefined)
    mockGetBlockedUsers.mockResolvedValue([])
  })

  describe('when request has no chat cookie (unauthenticated)', () => {
    it('should return 401', async () => {
      mockGetChatId.mockReturnValueOnce(undefined)
      const req = makePostRequest({ targetId: 'user_target' })
      const res = await POST(req)
      expect(res.status).toBe(401)
    })
  })

  describe('when targetId is missing from body', () => {
    it('should return 400', async () => {
      const req = makePostRequest({})
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/targetId/i)
    })
  })

  describe('when targetId is not a string', () => {
    it('should return 400', async () => {
      const req = makePostRequest({ targetId: 42 })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when user tries to block themselves', () => {
    it('should return 400', async () => {
      const req = makePostRequest({ targetId: 'user_blocker' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/block yourself/i)
    })
  })

  describe('when blocking a valid target', () => {
    it('should return 200 with success: true', async () => {
      const req = makePostRequest({ targetId: 'user_target' })
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { success: boolean }
      expect(json.success).toBe(true)
    })

    it('should call blockUser with the correct arguments', async () => {
      const req = makePostRequest({ targetId: 'user_target' })
      await POST(req)
      expect(mockBlockUser).toHaveBeenCalledWith('user_blocker', 'user_target')
    })
  })

  describe('when request body is invalid JSON', () => {
    it('should return 400', async () => {
      const req = new NextRequest('http://localhost/api/chat/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })
})

describe('GET /api/chat/block', () => {
  beforeEach(() => {
    mockGetChatId.mockReturnValue('user_blocker')
    mockGetBlockedUsers.mockResolvedValue([])
  })

  describe('when request has no chat cookie (unauthenticated)', () => {
    it('should return 401', async () => {
      mockGetChatId.mockReturnValueOnce(undefined)
      const req = makeGetRequest()
      const res = await GET(req)
      expect(res.status).toBe(401)
    })
  })

  describe('when user has no blocked users', () => {
    it('should return 200 with an empty array', async () => {
      mockGetBlockedUsers.mockResolvedValueOnce([])
      const req = makeGetRequest()
      const res = await GET(req)
      expect(res.status).toBe(200)
      const json = await res.json() as string[]
      expect(Array.isArray(json)).toBe(true)
      expect(json).toHaveLength(0)
    })
  })

  describe('when user has blocked users', () => {
    it('should return 200 with an array of blocked user IDs', async () => {
      mockGetBlockedUsers.mockResolvedValueOnce(['user_a', 'user_b'])
      const req = makeGetRequest()
      const res = await GET(req)
      expect(res.status).toBe(200)
      const json = await res.json() as string[]
      expect(json).toEqual(['user_a', 'user_b'])
    })

    it('should call getBlockedUsers with the caller chat ID', async () => {
      const req = makeGetRequest()
      await GET(req)
      expect(mockGetBlockedUsers).toHaveBeenCalledWith('user_blocker')
    })
  })
})
