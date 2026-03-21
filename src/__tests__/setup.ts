import { execSync } from 'child_process'
import path from 'path'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import { PrismaClient } from '@prisma/client'
import { beforeAll, beforeEach } from 'vitest'

const DB_PATH = path.resolve(process.cwd(), 'prisma/test.db')
const DB_URL = `file:${DB_PATH}`

const adapter = new PrismaBetterSqlite3({ url: DB_URL })
export const testDb = new PrismaClient({
  adapter,
} as ConstructorParameters<typeof PrismaClient>[0])

beforeAll(() => {
  execSync(
    `DATABASE_URL=${DB_URL} npx prisma db push --force-reset --schema=./prisma/schema.prisma`,
    { stdio: 'pipe' }
  )
})

beforeEach(async () => {
  // Delete in dependency order to respect FK constraints
  await testDb.chatBlock.deleteMany()
  await testDb.chatMessage.deleteMany()
  await testDb.chatUser.deleteMany()
  await testDb.comment.deleteMany()
  await testDb.session.deleteMany()
  await testDb.account.deleteMany()
  await testDb.verificationToken.deleteMany()
  await testDb.post.deleteMany()
  await testDb.tag.deleteMany()
  await testDb.user.deleteMany()
})
