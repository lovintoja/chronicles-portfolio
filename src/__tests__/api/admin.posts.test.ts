import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

vi.mock('@/lib/auth-utils', () => ({
  requireAdmin: vi.fn().mockResolvedValue({ user: { email: 'admin@test.com', id: 'usr_1' } }),
}))

vi.mock('@/lib/post.queries', () => ({
  getPostById: vi.fn(),
}))

import { GET } from '../../app/api/admin/posts/[id]/route'
import { requireAdmin } from '@/lib/auth-utils'
import { getPostById } from '@/lib/post.queries'

const mockRequireAdmin = vi.mocked(requireAdmin)
const mockGetPostById = vi.mocked(getPostById)

function makeRequest(id: string): NextRequest {
  return new NextRequest(`http://localhost/api/admin/posts/${id}`)
}

function makeParams(id: string): { params: Promise<{ id: string }> } {
  return { params: Promise.resolve({ id }) }
}

const fakePost = {
  id: 'post_abc',
  title: 'Sample Post',
  slug: 'sample-post',
  content: 'Content here',
  excerpt: null,
  headerImage: '',
  published: false,
  publishedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  authorId: 'usr_1',
  author: { id: 'usr_1', name: 'Admin', image: null },
}

describe('GET /api/admin/posts/[id]', () => {
  beforeEach(() => {
    mockRequireAdmin.mockResolvedValue({
      user: { email: 'admin@test.com', id: 'usr_1' },
    } as Awaited<ReturnType<typeof requireAdmin>>)
    mockGetPostById.mockResolvedValue(fakePost as Awaited<ReturnType<typeof getPostById>>)
  })

  describe('when user is not admin', () => {
    it('should return 401', async () => {
      mockRequireAdmin.mockRejectedValueOnce(new Error('Unauthorized'))

      const req = makeRequest('post_abc')
      const res = await GET(req, makeParams('post_abc'))
      expect(res.status).toBe(401)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/unauthorized/i)
    })
  })

  describe('when the post does not exist', () => {
    it('should return 404', async () => {
      mockGetPostById.mockResolvedValueOnce(null)

      const req = makeRequest('nonexistent')
      const res = await GET(req, makeParams('nonexistent'))
      expect(res.status).toBe(404)
      const json = await res.json() as { error: string }
      expect(json.error).toMatch(/not found/i)
    })
  })

  describe('when the post exists and user is admin', () => {
    it('should return 200 with the post object', async () => {
      const req = makeRequest('post_abc')
      const res = await GET(req, makeParams('post_abc'))
      expect(res.status).toBe(200)
      const json = await res.json() as typeof fakePost
      expect(json.id).toBe('post_abc')
      expect(json.title).toBe('Sample Post')
      expect(json.author).toBeDefined()
    })

    it('should call getPostById with the correct id', async () => {
      const req = makeRequest('post_xyz')
      mockGetPostById.mockResolvedValueOnce({ ...fakePost, id: 'post_xyz' } as Awaited<ReturnType<typeof getPostById>>)

      await GET(req, makeParams('post_xyz'))
      expect(mockGetPostById).toHaveBeenCalledWith('post_xyz')
    })
  })
})
