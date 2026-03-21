import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock next/cache and next/navigation before any imports that use them
vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))
vi.mock('next/navigation', () => ({
  redirect: vi.fn().mockImplementation((url: string) => {
    throw new Error(`NEXT_REDIRECT:${url}`)
  }),
  notFound: vi.fn(),
}))

// Default: requireAdmin resolves with a valid admin session
vi.mock('@/lib/auth-utils', () => ({
  requireAdmin: vi.fn().mockResolvedValue({
    user: { email: 'admin@test.com', id: 'usr_admin_posts' },
  }),
}))

import { createPost, updatePost, publishPost, deletePost } from '../../../app/actions/post.actions'
import { requireAdmin } from '@/lib/auth-utils'
import { testDb } from '../../setup'

const mockRequireAdmin = vi.mocked(requireAdmin)

function makeFormData(fields: Record<string, string>): FormData {
  const fd = new FormData()
  for (const [key, value] of Object.entries(fields)) {
    fd.append(key, value)
  }
  return fd
}

describe('post actions', () => {
  const adminId = 'usr_admin_posts'

  beforeEach(async () => {
    // Ensure the admin user exists in the test DB
    await testDb.user.upsert({
      where: { id: adminId },
      create: { id: adminId, email: 'admin@test.com', name: 'Admin' },
      update: {},
    })

    // Reset requireAdmin to succeed by default
    mockRequireAdmin.mockResolvedValue({
      user: { email: 'admin@test.com', id: adminId },
    } as Awaited<ReturnType<typeof requireAdmin>>)
  })

  describe('createPost', () => {
    describe('when title and content are provided', () => {
      it('should create the post in the DB and redirect to the edit page', async () => {
        const fd = makeFormData({
          title: 'My New Post',
          slug: 'my-new-post',
          content: 'Post body content here.',
          excerpt: 'Short excerpt',
          headerImage: 'https://example.com/img.png',
        })

        await expect(createPost(fd)).rejects.toThrow(/NEXT_REDIRECT/)

        const post = await testDb.post.findUnique({ where: { slug: 'my-new-post' } })
        expect(post).not.toBeNull()
        expect(post?.title).toBe('My New Post')
        expect(post?.content).toBe('Post body content here.')
        expect(post?.headerImage).toBe('https://example.com/img.png')
        expect(post?.authorId).toBe(adminId)
      })
    })

    describe('when title is missing', () => {
      it('should throw an error and not create the post', async () => {
        const fd = makeFormData({
          content: 'Some content',
        })
        await expect(createPost(fd)).rejects.toThrow(/title and content are required/i)
      })
    })

    describe('when content is missing', () => {
      it('should throw an error and not create the post', async () => {
        const fd = makeFormData({
          title: 'Title Only',
        })
        await expect(createPost(fd)).rejects.toThrow(/title and content are required/i)
      })
    })

    describe('when requireAdmin throws', () => {
      it('should propagate the error', async () => {
        mockRequireAdmin.mockRejectedValueOnce(new Error('NEXT_REDIRECT:/auth/signin'))

        const fd = makeFormData({ title: 'Title', content: 'Content' })
        await expect(createPost(fd)).rejects.toThrow()
      })
    })

    describe('when slug is not provided', () => {
      it('should auto-generate a slug from the title', async () => {
        const fd = makeFormData({
          title: 'Auto Slug Post',
          content: 'Some content',
        })

        await expect(createPost(fd)).rejects.toThrow(/NEXT_REDIRECT/)

        const post = await testDb.post.findFirst({ where: { title: 'Auto Slug Post' } })
        expect(post).not.toBeNull()
        expect(post?.slug).toBeTruthy()
        // Slug should be derived from the title
        expect(post?.slug).toMatch(/auto/i)
      })
    })
  })

  describe('updatePost', () => {
    describe('when updating a post with valid fields', () => {
      it('should update the post in the DB and redirect to admin', async () => {
        const existing = await testDb.post.create({
          data: {
            title: 'Original Title',
            slug: `original-slug-${Date.now()}`,
            content: 'Original content',
            authorId: adminId,
          },
        })

        const fd = makeFormData({
          title: 'Updated Title',
          slug: existing.slug,
          content: 'Updated content',
          headerImage: '',
        })

        await expect(updatePost(existing.id, fd)).rejects.toThrow(/NEXT_REDIRECT/)

        const updated = await testDb.post.findUnique({ where: { id: existing.id } })
        expect(updated?.title).toBe('Updated Title')
        expect(updated?.content).toBe('Updated content')
      })
    })

    describe('when requireAdmin throws', () => {
      it('should propagate the error without updating', async () => {
        mockRequireAdmin.mockRejectedValueOnce(new Error('NEXT_REDIRECT:/auth/signin'))

        const fd = makeFormData({ title: 'T', content: 'C' })
        await expect(updatePost('nonexistent-id', fd)).rejects.toThrow()
      })
    })
  })

  describe('publishPost', () => {
    describe('when toggling an unpublished post', () => {
      it('should set published to true and set publishedAt', async () => {
        const post = await testDb.post.create({
          data: {
            title: 'Draft Post',
            slug: `draft-${Date.now()}`,
            content: 'Draft content',
            authorId: adminId,
            published: false,
          },
        })

        await publishPost(post.id)

        const updated = await testDb.post.findUnique({ where: { id: post.id } })
        expect(updated?.published).toBe(true)
        expect(updated?.publishedAt).not.toBeNull()
      })
    })

    describe('when toggling a published post', () => {
      it('should set published to false and clear publishedAt', async () => {
        const post = await testDb.post.create({
          data: {
            title: 'Published Post',
            slug: `published-${Date.now()}`,
            content: 'Content',
            authorId: adminId,
            published: true,
            publishedAt: new Date(),
          },
        })

        await publishPost(post.id)

        const updated = await testDb.post.findUnique({ where: { id: post.id } })
        expect(updated?.published).toBe(false)
        expect(updated?.publishedAt).toBeNull()
      })
    })

    describe('when the post does not exist', () => {
      it('should throw an error', async () => {
        await expect(publishPost('nonexistent-id')).rejects.toThrow(/post not found/i)
      })
    })

    describe('when requireAdmin throws', () => {
      it('should propagate the error', async () => {
        mockRequireAdmin.mockRejectedValueOnce(new Error('NEXT_REDIRECT:/auth/signin'))
        await expect(publishPost('some-id')).rejects.toThrow()
      })
    })
  })

  describe('deletePost', () => {
    describe('when deleting an existing post', () => {
      it('should remove the post from the DB', async () => {
        const post = await testDb.post.create({
          data: {
            title: 'To Be Deleted',
            slug: `delete-me-${Date.now()}`,
            content: 'Bye bye',
            authorId: adminId,
          },
        })

        await deletePost(post.id)

        const deleted = await testDb.post.findUnique({ where: { id: post.id } })
        expect(deleted).toBeNull()
      })
    })

    describe('when the post does not exist', () => {
      it('should throw an error', async () => {
        await expect(deletePost('nonexistent-id')).rejects.toThrow(/post not found/i)
      })
    })

    describe('when requireAdmin throws', () => {
      it('should propagate the error without deleting', async () => {
        mockRequireAdmin.mockRejectedValueOnce(new Error('NEXT_REDIRECT:/auth/signin'))
        await expect(deletePost('some-id')).rejects.toThrow()
      })
    })
  })
})
