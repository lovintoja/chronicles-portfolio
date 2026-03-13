import { type NextRequest, NextResponse } from 'next/server'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import {
  chatUserExists,
  isBlocked,
  saveMessage,
  updateLastSeen,
} from '@/lib/chat/db-interface'
import * as sseManager from '@/lib/chat/sse-manager'

interface MessageRequestBody {
  recipientId: string
  content: string
}

function isMessageRequestBody(body: unknown): body is MessageRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).recipientId === 'string' &&
    typeof (body as Record<string, unknown>).content === 'string'
  )
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const chatId = getChatIdFromRequest(request)

    if (!chatId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: unknown
    try {
      body = await request.json()
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
    }

    if (!isMessageRequestBody(body)) {
      return NextResponse.json(
        { error: 'recipientId and content are required strings' },
        { status: 400 }
      )
    }

    const { recipientId, content } = body

    if (!recipientId.trim()) {
      return NextResponse.json({ error: 'recipientId must not be empty' }, { status: 400 })
    }

    if (!content.trim()) {
      return NextResponse.json({ error: 'content must not be empty' }, { status: 400 })
    }

    if (content.length > 2000) {
      return NextResponse.json(
        { error: 'content must not exceed 2000 characters' },
        { status: 400 }
      )
    }

    if (chatId === recipientId) {
      return NextResponse.json({ error: 'Cannot message yourself' }, { status: 400 })
    }

    const recipientExists = await chatUserExists(recipientId)
    if (!recipientExists) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    }

    const blocked = await isBlocked(recipientId, chatId)
    if (blocked) {
      // Silent drop — do not reveal the block to the sender
      return NextResponse.json({ delivered: false })
    }

    const message = await saveMessage({ senderId: chatId, recipientId, content })

    sseManager.sendToUser(recipientId, { type: 'message', data: message })

    await updateLastSeen(chatId)

    return NextResponse.json({ delivered: true, message })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
