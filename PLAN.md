# Blog Development Master Plan

## Phase 1: Foundation & Database
- [ ] Initialize Next.js project with Tailwind and TypeScript.
- [ ] Install Prisma, NextAuth, and Lucide React.
- [ ] Create `prisma/schema.prisma` with three models:
      1. `User` (NextAuth required fields).
      2. `Post` (id, title, slug, content, published, createdAt, authorId).
      3. `Comment` (id, postId, text, displayName, tripcode, createdAt).
- [ ] Push schema to PostgreSQL database.

## Phase 2: Authentication & Admin
- [ ] Set up NextAuth (`app/api/auth/[...nextauth]/route.ts`) with GitHub provider and Prisma Adapter.
- [ ] Create `/admin` route.
- [ ] Secure `/admin` route: Check session. If `session.user.email !== process.env.ADMIN_EMAIL`, redirect to home.
- [ ] Build Admin UI: Form to create a new `Post` (Title, Slug, Markdown/Text Content).
- [ ] Create Server Action to save new Post to database.

## Phase 3: Public Blog Views
- [ ] Update `/app/page.tsx` to list all published `Post` entries (Title, Date, Link).
- [ ] Create `/app/post/[slug]/page.tsx` to fetch and display a single post based on the URL slug. Handle 404s.

## Phase 4: Tripcode Commenting System
- [ ] In `/app/post/[slug]/page.tsx`, build a comment form at the bottom (Name input, Comment textarea).
- [ ] Create a Server Action to handle comment submission, implementing the Tripcode parsing logic defined in `CLAUDE.md`.
- [ ] Fetch and display comments below the form.
- [ ] Style comments: If a `tripcode` exists, display it prominently next to the `displayName` (e.g., `Name ◆ a1b2c3`).