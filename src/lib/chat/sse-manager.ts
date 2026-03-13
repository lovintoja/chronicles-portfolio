// NOTE: This module uses module-level singleton state.
// This works correctly for single-instance deployments only.
// In a multi-instance or serverless environment, a shared pub/sub
// broker (e.g., Redis) would be required.

import type { SSEEvent } from './types'

interface ConnectionEntry {
  controller: ReadableStreamDefaultController
  encoder: TextEncoder
}

interface ActiveUserEntry {
  connectedAt: Date
  lastSeen: Date
}

const connections = new Map<string, ConnectionEntry>()
const activeUsers = new Map<string, ActiveUserEntry>()

export function register(
  chatId: string,
  controller: ReadableStreamDefaultController,
  encoder: TextEncoder
): void {
  connections.set(chatId, { controller, encoder })
  activeUsers.set(chatId, {
    connectedAt: new Date(),
    lastSeen: new Date(),
  })
}

export function remove(chatId: string): void {
  connections.delete(chatId)
  activeUsers.delete(chatId)
}

export function sendToUser(chatId: string, event: SSEEvent): boolean {
  const connection = connections.get(chatId)
  if (!connection) {
    return false
  }

  try {
    const payload = `data: ${JSON.stringify(event)}\n\n`
    connection.controller.enqueue(connection.encoder.encode(payload))
    return true
  } catch {
    // Controller may have been closed; clean up
    remove(chatId)
    return false
  }
}

export function getActiveUserIds(): string[] {
  return Array.from(connections.keys())
}

export function updateLastSeen(chatId: string): void {
  const entry = activeUsers.get(chatId)
  if (entry) {
    entry.lastSeen = new Date()
  }
}

export function isOnline(chatId: string): boolean {
  return connections.has(chatId)
}
