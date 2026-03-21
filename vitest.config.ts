import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    fileParallelism: false,
    setupFiles: ['./src/__tests__/setup.ts'],
    env: {
      DATABASE_URL: 'file:./prisma/test.db',
      TRIPCODE_SECRET: 'test-tripcode-secret',
      ADMIN_EMAIL: 'admin@test.com',
      ADMIN_GITHUB_LOGIN: 'testadmin',
      CONTACT_EMAIL_TO: 'test@test.com',
      SMTP_HOST: 'localhost',
      SMTP_PORT: '587',
      SMTP_USER: 'test',
      SMTP_PASS: 'test',
      NEXTCLOUD_URL: 'https://cloud.example.com',
      NEXTCLOUD_USER: 'testuser',
      NEXTCLOUD_APP_PASSWORD: 'testpass',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/lib/**', 'src/app/actions/**', 'src/app/api/**'],
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
