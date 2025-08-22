import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

let _prisma: PrismaClient | undefined

export function getPrismaClient(): PrismaClient {
  if (!_prisma) {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    _prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    if (process.env.NODE_ENV !== 'production') {
      globalForPrisma.prisma = _prisma
    }
  }
  
  return _prisma
}

// Export a default that uses the lazy getter
export const prisma = new Proxy({} as PrismaClient, {
  get(target, prop) {
    // During build time, return a mock function
    if (typeof process === 'undefined' || !process.env?.DATABASE_URL) {
      return () => Promise.resolve(null)
    }
    return getPrismaClient()[prop as keyof PrismaClient]
  }
})

export default prisma 