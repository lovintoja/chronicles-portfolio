import { type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

export const CHAT_COOKIE = 'chat_uid'
export const CHAT_COOKIE_MAX_AGE = 60 * 60 * 24 * 365  // 1 year

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; take the first entry
    const first = forwarded.split(',')[0].trim()
    if (first) return first
  }

  const realIp = request.headers.get('x-real-ip')
  if (realIp) {
    return realIp.trim()
  }

  return '0.0.0.0'
}

export async function getChatIdFromCookies(): Promise<string | undefined> {
  const cookieStore = await cookies()
  return cookieStore.get(CHAT_COOKIE)?.value
}

export function getChatIdFromRequest(request: NextRequest): string | undefined {
  return request.cookies.get(CHAT_COOKIE)?.value
}
