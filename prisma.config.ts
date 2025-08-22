import { defineConfig } from 'prisma'

export default defineConfig({
  schema: './prisma/schema.prisma',
  out: './node_modules/.prisma',
  generate: {
    client: {
      binaryTargets: ['native', 'linux-musl'],
    },
  },
})
