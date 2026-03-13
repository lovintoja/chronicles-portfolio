import { type NextRequest, NextResponse } from 'next/server'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import { getConversations } from '@/lib/chat/db-interface'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const chatId = getChatIdFromRequest(request)

    if (!chatId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await getConversations(chatId)
    return NextResponse.json(conversations)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
