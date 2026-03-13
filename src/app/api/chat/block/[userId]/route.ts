import { type NextRequest, NextResponse } from 'next/server'
import { getChatIdFromRequest } from '@/lib/chat/identity'
import { unblockUser } from '@/lib/chat/db-interface'

interface RouteParams {
  params: Promise<{ userId: string }>
}

export async function DELETE(request: NextRequest, { params }: RouteParams): Promise<NextResponse> {
  try {
    const chatId = getChatIdFromRequest(request)

    if (!chatId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { userId } = await params

    await unblockUser(chatId, userId)

    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
