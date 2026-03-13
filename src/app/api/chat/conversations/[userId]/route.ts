import { type NextRequest, NextResponse } from 'next/server'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import { getMessagesWith, markMessagesRead } from '@/lib/chat/db-interface'

interface RouteParams {
  params: Promise<{ userId: string }>
}

export async function GET(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const chatId = getChatIdFromRequest(request)

    if (!chatId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params

    const messages = await getMessagesWith(chatId, userId)

    // Mark messages from this partner as read (fire and forget — don't block response)
    markMessagesRead(chatId, userId).catch(() => {
      // Best-effort; ignore failure to avoid breaking the response
    })

    return NextResponse.json(messages)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
