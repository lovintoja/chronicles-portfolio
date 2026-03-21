import { describe, it, expect } from 'vitest'
import { getClientIp } from '@/lib/chat/identity'
import type { NextRequest } from 'next/server'

function makeRequest(headers: Record<string, string>): NextRequest {
  return {
    headers: {
      get: (name: string) => headers[name.toLowerCase()] ?? null,
    },
  } as unknown as NextRequest
}

describe('getClientIp', () => {
  describe('when x-forwarded-for contains a single IP', () => {
    it('should return that IP', () => {
      const req = makeRequest({ 'x-forwarded-for': '1.2.3.4' })
      expect(getClientIp(req)).toBe('1.2.3.4')
    })
  })

  describe('when x-forwarded-for contains a comma-separated list', () => {
    it('should return the first IP in the list', () => {
      const req = makeRequest({ 'x-forwarded-for': '1.2.3.4, 5.6.7.8, 9.10.11.12' })
      expect(getClientIp(req)).toBe('1.2.3.4')
    })
  })

  describe('when x-forwarded-for is absent but x-real-ip is present', () => {
    it('should return the x-real-ip value', () => {
      const req = makeRequest({ 'x-real-ip': '10.0.0.1' })
      expect(getClientIp(req)).toBe('10.0.0.1')
    })
  })

  describe('when no IP headers are present', () => {
    it('should return 0.0.0.0', () => {
      const req = makeRequest({})
      expect(getClientIp(req)).toBe('0.0.0.0')
    })
  })
})
