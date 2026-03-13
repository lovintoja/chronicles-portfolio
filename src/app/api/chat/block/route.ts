import { type NextRequest, NextResponse } from 'next/server'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import { blockUser, getBlockedUsers } from '@/lib/chat/db-interface'

interface BlockRequestBody {
  targetId: string
}

function isBlockRequestBody(body: unknown): body is BlockRequestBody {
  return (
    typeof body === 'object' &&
    body !== null &&
    typeof (body as Record<string, unknown>).targetId === 'string'
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

    if (!isBlockRequestBody(body)) {
      return NextResponse.json({ error: 'targetId is required' }, { status: 400 })
    }

    const { targetId } = body

    if (chatId === targetId) {
      return NextResponse.json({ error: 'Cannot block yourself' }, { status: 400 })
    }

    await blockUser(chatId, targetId)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const chatId = getChatIdFromRequest(request)

    if (!chatId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const blocked = await getBlockedUsers(chatId)
    return NextResponse.json(blocked)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
