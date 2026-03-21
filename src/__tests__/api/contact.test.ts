import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockSendMail = vi.fn().mockResolvedValue({})
const mockCreateTransport = vi.fn(() => ({ sendMail: mockSendMail }))

vi.mock('nodemailer', () => ({
  default: { createTransport: mockCreateTransport },
}))

import { POST } from '../../app/api/contact/route'

function makeRequest(body: unknown): NextRequest {
  return new NextRequest('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  beforeEach(() => {
    mockSendMail.mockReset()
    mockSendMail.mockResolvedValue({})
  })

  describe('when name is missing', () => {
    it('should return 400', async () => {
      const req = makeRequest({ email: 'user@example.com', message: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/name/i)
    })
  })

  describe('when name is empty string', () => {
    it('should return 400', async () => {
      const req = makeRequest({ name: '   ', email: 'user@example.com', message: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when email is missing', () => {
    it('should return 400', async () => {
      const req = makeRequest({ name: 'Alice', message: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/email/i)
    })
  })

  describe('when email is empty string', () => {
    it('should return 400', async () => {
      const req = makeRequest({ name: 'Alice', email: '   ', message: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when email format is invalid', () => {
    it('should return 400 with a validation message', async () => {
      const req = makeRequest({ name: 'Alice', email: 'not-an-email', message: 'Hello' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/valid email/i)
    })
  })

  describe('when message is missing', () => {
    it('should return 400', async () => {
      const req = makeRequest({ name: 'Alice', email: 'alice@example.com' })
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/message/i)
    })
  })

  describe('when message is empty string', () => {
    it('should return 400', async () => {
      const req = makeRequest({ name: 'Alice', email: 'alice@example.com', message: '   ' })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when all fields are valid', () => {
    it('should call sendMail and return 200 with success: true', async () => {
      const req = makeRequest({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'This is my message.',
      })
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { success: boolean }
      expect(json.success).toBe(true)
      expect(mockSendMail).toHaveBeenCalledOnce()

      const [mailOptions] = mockSendMail.mock.calls[0] as [Record<string, unknown>]
      expect(mailOptions.replyTo).toBe('alice@example.com')
      expect(String(mailOptions.subject)).toContain('Alice')
    })
  })

  describe('when SMTP sendMail throws', () => {
    it('should return 500', async () => {
      mockSendMail.mockRejectedValueOnce(new Error('SMTP connection refused'))

      const req = makeRequest({
        name: 'Alice',
        email: 'alice@example.com',
        message: 'This is my message.',
      })
      const res = await POST(req)
      expect(res.status).toBe(500)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/failed to send/i)
    })
  })

  describe('when request body is invalid JSON', () => {
    it('should return 400', async () => {
      const req = new NextRequest('http://localhost/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: 'not json',
      })
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })
})
