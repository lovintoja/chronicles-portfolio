import { describe, it, expect, vi, beforeEach } from 'vitest'
import crypto from 'crypto'

// Mock next/cache and next/navigation before imports
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({ redirect: vi.fn(), notFound: vi.fn() }))

// Import after mocks
import { submitComment } from '../../../app/actions/comment.actions'
import { testDb } from '../../setup'

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

describe('submitComment', () => {
  let postId: string

  beforeEach(async () => {
    // Seed a user and post to attach comments to
    const user = await testDb.user.create({
      data: {
        id: 'usr_comment_test',
        email: 'admin@test.com',
        name: 'Admin',
      },
    })
    const post = await testDb.post.create({
      data: {
        title: 'Test Post',
        slug: `test-post-${Date.now()}`,
        content: 'Test content',
        authorId: user.id,
      },
    })
    postId = post.id
  })

  describe('when postId is missing', () => {
    it('should return an error response', async () => {
      const fd = makeFormData({
        postSlug: 'test-post',
        name: 'Alice',
        body: 'Hello world',
      })
      const result = await submitComment({}, fd)
      expect(result.error).toBeTruthy()
      expect(result.success).toBeUndefined()
    })
  })

  describe('when name is empty', () => {
    it('should return an error response', async () => {
      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: '   ',
        body: 'Hello world',
      })
      const result = await submitComment({}, fd)
      expect(result.error).toBeTruthy()
      expect(result.success).toBeUndefined()
    })
  })

  describe('when body is empty', () => {
    it('should return an error response', async () => {
      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: 'Alice',
        body: '   ',
      })
      const result = await submitComment({}, fd)
      expect(result.error).toBeTruthy()
      expect(result.success).toBeUndefined()
    })
  })

  describe('when body exceeds 2000 characters', () => {
    it('should return an error response', async () => {
      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: 'Alice',
        body: 'a'.repeat(2001),
      })
      const result = await submitComment({}, fd)
      expect(result.error).toMatch(/2000/i)
      expect(result.success).toBeUndefined()
    })
  })

  describe('when valid input without tripcode delimiter', () => {
    it('should return success and create DB record with displayName and null tripcode', async () => {
      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: 'Alice',
        body: 'This is a great post!',
      })
      const result = await submitComment({}, fd)
      expect(result.success).toBe(true)
      expect(result.error).toBeUndefined()

      const comment = await testDb.comment.findFirst({
        where: { postId, displayName: 'Alice' },
      })
      expect(comment).not.toBeNull()
      expect(comment?.displayName).toBe('Alice')
      expect(comment?.tripcode).toBeNull()
      expect(comment?.body).toBe('This is a great post!')
    })
  })

  describe('when valid input with tripcode delimiter', () => {
    it('should return success and store the first 6 chars of the HMAC hash as tripcode', async () => {
      const password = 'secret123'
      const expectedHash = crypto
        .createHmac('sha256', 'test-tripcode-secret')
        .update(password)
        .digest('hex')
      const expectedTripcode = expectedHash.slice(0, 6)

      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: `Bob#${password}`,
        body: 'Comment with tripcode',
      })
      const result = await submitComment({}, fd)
      expect(result.success).toBe(true)

      const comment = await testDb.comment.findFirst({
        where: { postId, displayName: 'Bob' },
      })
      expect(comment).not.toBeNull()
      expect(comment?.displayName).toBe('Bob')
      expect(comment?.tripcode).toBe(expectedTripcode)
    })
  })

  describe('when name has no left-side before the # delimiter', () => {
    it('should store displayName as Anonymous and include the tripcode', async () => {
      const fd = makeFormData({
        postId,
        postSlug: 'test-post',
        name: '#justpassword',
        body: 'Anonymous tripcode comment',
      })
      const result = await submitComment({}, fd)
      expect(result.success).toBe(true)

      const comment = await testDb.comment.findFirst({
        where: { postId, body: 'Anonymous tripcode comment' },
      })
      expect(comment?.displayName).toBe('Anonymous')
      expect(comment?.tripcode).toHaveLength(6)
    })
  })
})
