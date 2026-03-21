import { describe, it, expect, vi } from 'vitest'
import { testDb } from '../../setup'

// Mock @/lib/db so the query module uses the test database
vi.mock('@/lib/db', () => ({ db: testDb }))

import { getCommentsByPostId } from '@/lib/comment.queries'

async function createAuthor(id: string) {
  return testDb.user.create({
    data: {
      id,
      name: 'Comment Test Author',
      email: `${id}@test.com`,
    },
  })
}

async function createPost(authorId: string, slug: string) {
  return testDb.post.create({
    data: {
      title: 'Post for Comments',
      slug,
      content: 'Content',
      published: true,
      publishedAt: new Date(),
      authorId,
    },
  })
}

describe('getCommentsByPostId', () => {
  it('should return comments for a post in ascending createdAt order', async () => {
    const author = await createAuthor('author-cmt-order')
    const post = await createPost(author.id, 'cmt-order-slug')

    await testDb.comment.create({
      data: {
        postId: post.id,
        displayName: 'First',
        body: 'First comment',
        createdAt: new Date('2024-01-01T10:00:00Z'),
      },
    })
    await testDb.comment.create({
      data: {
        postId: post.id,
        displayName: 'Second',
        body: 'Second comment',
        createdAt: new Date('2024-01-01T11:00:00Z'),
      },
    })
    await testDb.comment.create({
      data: {
        postId: post.id,
        displayName: 'Third',
        body: 'Third comment',
        createdAt: new Date('2024-01-01T12:00:00Z'),
      },
    })

    const comments = await getCommentsByPostId(post.id)
    expect(comments).toHaveLength(3)
    expect(comments[0].displayName).toBe('First')
    expect(comments[1].displayName).toBe('Second')
    expect(comments[2].displayName).toBe('Third')
  })

  it('should return an empty array for a post with no comments', async () => {
    const author = await createAuthor('author-cmt-empty')
    const post = await createPost(author.id, 'cmt-empty-slug')

    const comments = await getCommentsByPostId(post.id)
    expect(comments).toEqual([])
  })
})
