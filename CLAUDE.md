@~/.claude/CLAUDE.md
# Project Overview
This is a personal blog built with Next.js (App Router), TypeScript, Tailwind CSS, Prisma, and NextAuth. 
It features an admin-only area for creating posts and a public-facing commenting system that uses "Tripcodes" instead of user accounts.

# Tech Stack & Standards
- **Framework:** Next.js (App Router). Strictly use App Router conventions (`app/page.tsx`, `app/layout.tsx`, `app/api/route.ts`).
- **React:** Use React Server Components by default. Only use `"use client"` at the very top of a file when hooks (useState, useEffect) or browser APIs are explicitly required.
- **Styling:** Tailwind CSS. Keep classes clean and organized. Use `lucide-react` for any icons.
- **Database:** PostgreSQL accessed via Prisma ORM. 
- **TypeScript:** Enforce strict typing. Do not use `any`. Define proper interfaces for all component props.

# Core Logic Rules
- **Admin Authentication:** NextAuth using the GitHub provider. The admin dashboard MUST be protected. Only the exact email address specified in `process.env.ADMIN_EMAIL` is allowed to log in and create posts.
- **Tripcode Logic (Comments):** - Comments do not require a login.
  - The input field is a single string (e.g., `Username#password`).
  - On submission (Server Action or API), check for the `#` delimiter.
  - If no `#`, save the input as `displayName` and leave `tripcode` null.
  - If `#` exists, split the string at the *first* `#`. The left side is `displayName`. 
  - The right side is the password. Hash it using `crypto.createHmac('sha256', process.env.TRIPCODE_SECRET).update(password).digest('hex')`.
  - Save the first 6 characters of that hash as the `tripcode` string in the database.

# Testing Requirements
Every new piece of functionality MUST include tests. This is non-negotiable.

- **New API route** → add `src/__tests__/api/{route}.test.ts` covering: auth checks, all validation error paths, happy path, external service mocking
- **New server action** → add `src/__tests__/integration/actions/{action}.test.ts` covering: validation errors, auth check, DB side effects, success state
- **New utility function** → add `src/__tests__/unit/lib/{file}.test.ts` covering: all code paths, edge cases, boundary values
- **New DB query function** → add test in the relevant `src/__tests__/integration/lib/` file covering: returns correct data, filters correctly, empty results

Run `npm test` before every commit. A failing test suite blocks merging.