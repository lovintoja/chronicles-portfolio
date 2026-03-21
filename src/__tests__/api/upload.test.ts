import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth-utils', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ user: { email: 'admin@test.com', id: 'usr_1' } }),
}))

import { POST } from '../../app/api/upload/route'
import { requireAdmin } from '@/lib/auth-utils'

const mockRequireAdmin = vi.mocked(requireAdmin)

function makeUploadRequest(file: File | null): NextRequest {
  const fd = new FormData()
  if (file) fd.append('image', file)

  return new NextRequest('http://localhost/api/upload', {
    method: 'POST',
    body: fd,
  })
}

function makeFakeFile(mimeType: string, content = 'fake-image-data'): File {
  return new File([content], 'test-image.png', { type: mimeType })
}

function buildXmlResponse(token: string): string {
  return `<?xml version="1.0"?><ocs><data><token>${token}</token></data></ocs>`
}

describe('POST /api/upload', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
    mockRequireAdmin.mockResolvedValue({
      user: { email: 'admin@test.com', id: 'usr_1' },
    } as Awaited<ReturnType<typeof requireAdmin>>)
  })

  describe('when user is not admin', () => {
    it('should return 401', async () => {
      mockRequireAdmin.mockRejectedValueOnce(new Error('Unauthorized'))

      const req = makeUploadRequest(makeFakeFile('image/png'))
      const res = await POST(req)
      expect(res.status).toBe(401)
    })
  })

  describe('when no file is provided in form data', () => {
    it('should return 400', async () => {
      const req = makeUploadRequest(null)
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/no file/i)
    })
  })

  describe('when the MIME type is invalid', () => {
    it('should return 400 for a text/plain file', async () => {
      const file = makeFakeFile('text/plain')
      const req = makeUploadRequest(file)
      const res = await POST(req)
      expect(res.status).toBe(400)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/invalid file type/i)
    })

    it('should return 400 for application/pdf', async () => {
      const file = makeFakeFile('application/pdf')
      const req = makeUploadRequest(file)
      const res = await POST(req)
      expect(res.status).toBe(400)
    })
  })

  describe('when Nextcloud PUT returns a non-2xx status', () => {
    it('should return 502', async () => {
      const mockFetch = vi.mocked(fetch)
      // First call: MKCOL succeeds
      mockFetch.mockResolvedValueOnce(new Response('', { status: 201 }))
      // Second call: PUT fails
      mockFetch.mockResolvedValueOnce(new Response('Server Error', { status: 500 }))

      const req = makeUploadRequest(makeFakeFile('image/png'))
      const res = await POST(req)
      expect(res.status).toBe(502)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/upload to nextcloud/i)
    })
  })

  describe('when MKCOL returns a non-2xx non-405 status', () => {
    it('should return 502', async () => {
      vi.mocked(fetch).mockResolvedValueOnce(new Response('Forbidden', { status: 403 }))

      const req = makeUploadRequest(makeFakeFile('image/png'))
      const res = await POST(req)
      expect(res.status).toBe(502)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/blog folder/i)
    })
  })

  describe('when share creation returns XML with no token', () => {
    it('should return 502', async () => {
      const mockFetch = vi.mocked(fetch)
      // First call: MKCOL succeeds (folder already exists)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 405 }))
      // Second call: PUT upload succeeds
      mockFetch.mockResolvedValueOnce(new Response('', { status: 201 }))
      // Third call: share creation returns XML without a token
      mockFetch.mockResolvedValueOnce(
        new Response('<ocs><data></data></ocs>', { status: 200 })
      )

      const req = makeUploadRequest(makeFakeFile('image/png'))
      const res = await POST(req)
      expect(res.status).toBe(502)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/share/i)
    })
  })

  describe('when upload succeeds and share is created', () => {
    it('should return 200 with a URL containing the share token', async () => {
      const mockFetch = vi.mocked(fetch)
      // First call: MKCOL (folder already exists → 405)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 405 }))
      // Second call: PUT upload succeeds
      mockFetch.mockResolvedValueOnce(new Response('', { status: 201 }))
      // Third call: share creation returns XML with token
      mockFetch.mockResolvedValueOnce(
        new Response(buildXmlResponse('abc123token'), { status: 200 })
      )

      const req = makeUploadRequest(makeFakeFile('image/png'))
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { url: string }
      expect(json.url).toContain('abc123token')
      expect(json.url).toContain('preview')
    })

    it('should accept image/jpeg files', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 405 }))
      mockFetch.mockResolvedValueOnce(new Response('', { status: 200 }))
      mockFetch.mockResolvedValueOnce(
        new Response(buildXmlResponse('jpegtoken'), { status: 200 })
      )

      const file = makeFakeFile('image/jpeg')
      const req = makeUploadRequest(file)
      const res = await POST(req)
      expect(res.status).toBe(200)
      const json = await res.json() as { url: string }
      expect(json.url).toContain('jpegtoken')
    })

    it('should accept image/gif files', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 405 }))
      mockFetch.mockResolvedValueOnce(new Response('', { status: 200 }))
      mockFetch.mockResolvedValueOnce(
        new Response(buildXmlResponse('giftoken'), { status: 200 })
      )

      const file = makeFakeFile('image/gif')
      const req = makeUploadRequest(file)
      const res = await POST(req)
      expect(res.status).toBe(200)
    })

    it('should accept image/webp files', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce(new Response('', { status: 405 }))
      mockFetch.mockResolvedValueOnce(new Response('', { status: 200 }))
      mockFetch.mockResolvedValueOnce(
        new Response(buildXmlResponse('webptoken'), { status: 200 })
      )

      const file = makeFakeFile('image/webp')
      const req = makeUploadRequest(file)
      const res = await POST(req)
      expect(res.status).toBe(200)
    })
  })
})
