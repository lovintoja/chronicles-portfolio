import { type NextRequest, NextResponse } from 'next/server'
import {
  CHAT_COOKIE,
  CHAT_COOKIE_MAX_AGE,
  getChatIdFromRequest,
  getClientIp,
} from '@/lib/chat/identity'
import { findOrCreateChatUser } from '@/lib/chat/db-interface'

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const existing = getChatIdFromRequest(request)

    if (existing) {
      return NextResponse.json({ chatId: existing, isNew: false })
    }

    const chatId = crypto.randomUUID()
    const ip = getClientIp(request)

    await findOrCreateChatUser(chatId, ip)

    const response = NextResponse.json({ chatId, isNew: true })
    response.cookies.set(CHAT_COOKIE, chatId, {
      httpOnly: true,
      sameSite: 'strict',
      path: '/',
      maxAge: CHAT_COOKIE_MAX_AGE,
    })

    return response
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
