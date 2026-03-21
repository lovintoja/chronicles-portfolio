import { describe, it, expect, beforeEach } from 'vitest'
import {
  register,
  remove,
  sendToUser,
  getActiveUserIds,
  isOnline,
} from '@/lib/chat/sse-manager'
import type { SSEEvent } from '@/lib/chat/types'

// Helper to create a minimal mock controller and encoder
function makeConnection(): {
  controller: ReadableStreamDefaultController
  encoder: TextEncoder
} {
  const queued: Uint8Array[] = []
  const controller = {
    enqueue: (chunk: Uint8Array) => queued.push(chunk),
  } as unknown as ReadableStreamDefaultController
  const encoder = new TextEncoder()
  return { controller, encoder }
}

// Track IDs registered in each test so we can clean up the singleton state
let registeredIds: string[] = []

beforeEach(() => {
  for (const id of registeredIds) {
    remove(id)
  }
  registeredIds = []
})

function registerUser(chatId: string): void {
  const { controller, encoder } = makeConnection()
  register(chatId, controller, encoder)
  registeredIds.push(chatId)
}

describe('sse-manager', () => {
  describe('register', () => {
    it('should make the user appear in getActiveUserIds()', () => {
      registerUser('user-a')
      expect(getActiveUserIds()).toContain('user-a')
    })
  })

  describe('remove', () => {
    it('should remove the user from getActiveUserIds()', () => {
      registerUser('user-b')
      remove('user-b')
      registeredIds = registeredIds.filter((id) => id !== 'user-b')
      expect(getActiveUserIds()).not.toContain('user-b')
    })
  })

  describe('sendToUser', () => {
    it('should return true for a registered user', () => {
      registerUser('user-c')
      const event: SSEEvent = { type: 'connected', data: null }
      expect(sendToUser('user-c', event)).toBe(true)
    })

    it('should return false for an unknown user', () => {
      const event: SSEEvent = { type: 'connected', data: null }
      expect(sendToUser('user-unknown-xyz', event)).toBe(false)
    })
  })

  describe('isOnline', () => {
    it('should return true after register', () => {
      registerUser('user-d')
      expect(isOnline('user-d')).toBe(true)
    })

    it('should return false after remove', () => {
      registerUser('user-e')
      remove('user-e')
      registeredIds = registeredIds.filter((id) => id !== 'user-e')
      expect(isOnline('user-e')).toBe(false)
    })
  })
})
