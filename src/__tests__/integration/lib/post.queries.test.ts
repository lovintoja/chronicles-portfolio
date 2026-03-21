import { describe, it, expect, vi, beforeAll } from 'vitest'
import { testDb } from '../../setup'

// Mock @/lib/db so all query modules use the test database
vi.mock('@/lib/db', () => ({ db: testDb }))

import {
  getAllPublishedPosts,
  getPostBySlug,
  getAllPostsForAdmin,
  getRecentPublishedPosts,
  getAllPublishedSlugs,
} from '@/lib/post.queries'

async function createAuthor(id: string) {
  return testDb.user.create({
    data: {
      id,
      name: 'Test Author',
      email: `${id}@test.com`,
    },
  })
}

async function createPost(
  authorId: string,
  overrides: {
    title?: string
    slug?: string
    content?: string
    published?: boolean
    publishedAt?: Date
  } = {}
) {
  const slug = overrides.slug ?? `slug-${Math.random().toString(36).slice(2)}`
  return testDb.post.create({
    data: {
      title: overrides.title ?? 'Test Post',
      slug,
      content: overrides.content ?? 'Some content',
      published: overrides.published ?? false,
      publishedAt: overrides.publishedAt ?? null,
      authorId,
    },
  })
}

describe('getAllPublishedPosts') {
  it('should return only published posts', async () => {
    const author = await createAuthor('author-gapp')
    await createPost(author.id, { published: false, slug: 'draft-post' })
    await createPost(author.id, { published: true, slug: 'pub-post', publishedAt: new Date() })

    const posts = await getAllPublishedPosts()
    expect(posts.every((p) => p.published)).toBe(true)
    expect(posts.some((p) => p.slug === 'pub-post')).toBe(true)
    expect(posts.some((p) => p.slug === 'draft-post')).toBe(false)
  })

  it('should order results by publishedAt descending', async () => {
    const author = await createAuthor('author-gapp-order')
    const older = new Date('2024-01-01')
    const newer = new Date('2024-06-01')
    await createPost(author.id, { published: true, slug: 'older-post', publishedAt: older })
    await createPost(author.id, { published: true, slug: 'newer-post', publishedAt: newer })

    const posts = await getAllPublishedPosts()
    const slugs = posts.map((p) => p.slug)
    expect(slugs.indexOf('newer-post')).toBeLessThan(slugs.indexOf('older-post'))
  })
}

describe('getPostBySlug') {
  it('should return the post when it is published', async () => {
    const author = await createAuthor('author-gpbs-pub')
    await createPost(author.id, { published: true, slug: 'published-slug', publishedAt: new Date() })

    const post = await getPostBySlug('published-slug')
    expect(post).not.toBeNull()
    expect(post?.slug).toBe('published-slug')
  })

  it('should return null for a draft post', async () => {
    const author = await createAuthor('author-gpbs-draft')
    await createPost(author.id, { published: false, slug: 'draft-slug' })

    const post = await getPostBySlug('draft-slug')
    expect(post).toBeNull()
  })

  it('should return null when the slug does not exist', async () => {
    const post = await getPostBySlug('nonexistent-slug-xyz')
    expect(post).toBeNull()
  })
}

describe('getAllPostsForAdmin') {
  it('should return both draft and published posts', async () => {
    const author = await createAuthor('author-gapfa')
    await createPost(author.id, { published: false, slug: 'admin-draft' })
    await createPost(author.id, { published: true, slug: 'admin-published', publishedAt: new Date() })

    const posts = await getAllPostsForAdmin()
    const slugs = posts.map((p) => p.slug)
    expect(slugs).toContain('admin-draft')
    expect(slugs).toContain('admin-published')
  })
}

describe('getRecentPublishedPosts') {
  it('should return at most the requested number of posts, most recent first', async () => {
    const author = await createAuthor('author-grpp')
    await createPost(author.id, {
      published: true,
      slug: 'recent-oldest',
      publishedAt: new Date('2024-01-01'),
    })
    await createPost(author.id, {
      published: true,
      slug: 'recent-middle',
      publishedAt: new Date('2024-03-01'),
    })
    await createPost(author.id, {
      published: true,
      slug: 'recent-newest',
      publishedAt: new Date('2024-06-01'),
    })

    const posts = await getRecentPublishedPosts(2)
    expect(posts).toHaveLength(2)
    expect(posts[0].slug).toBe('recent-newest')
    expect(posts[1].slug).toBe('recent-middle')
  })
}

describe('getAllPublishedSlugs') {
  it('should return slugs only for published posts', async () => {
    const author = await createAuthor('author-gaps')
    await createPost(author.id, { published: false, slug: 'unpublished-slug-gaps' })
    await createPost(author.id, { published: true, slug: 'published-slug-gaps', publishedAt: new Date() })

    const slugs = await getAllPublishedSlugs()
    const slugValues = slugs.map((s) => s.slug)
    expect(slugValues).toContain('published-slug-gaps')
    expect(slugValues).not.toContain('unpublished-slug-gaps')
  })
}
