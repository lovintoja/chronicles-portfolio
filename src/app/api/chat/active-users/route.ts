import { NextResponse } from 'next/server'
import { getActiveUserIds } from '@/lib/chat/sse-manager'

export async function GET(): Promise<NextResponse> {
  try {
    const userIds = getActiveUserIds()
    return NextResponse.json({ count: userIds.length, userIds })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
