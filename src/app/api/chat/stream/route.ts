export const dynamic = 'force-dynamic'

import { type NextRequest } from 'next/server'
import { getChatIdFromRequest, getClientIp } from '@/lib/chat/identity'
import { findOrCreateChatUser } from '@/lib/chat/db-interface'
import * as sseManager from '@/lib/chat/sse-manager'
import type { SSEEvent } from '@/lib/chat/types'

export async function GET(request: NextRequest): Promise<Response> {
  const chatId = getChatIdFromRequest(request)

  if (!chatId) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const ip = getClientIp(request)

  try {
    await findOrCreateChatUser(chatId, ip)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  const stream = new ReadableStream({
    start(controller) {
      const encoder = new TextEncoder()

      sseManager.register(chatId, controller, encoder)
      sseManager.updateLastSeen(chatId)

      const connectedEvent: SSEEvent = { type: 'connected', data: { chatId } }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify(connectedEvent)}\n\n`))

      const heartbeatInterval = setInterval(() => {
        try {
          controller.enqueue(encoder.encode(': heartbeat\n\n'))
        } catch {
          clearInterval(heartbeatInterval)
        }
      }, 25_000)

      request.signal.addEventListener('abort', () => {
        clearInterval(heartbeatInterval)
        sseManager.remove(chatId)
      })
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  })
}
