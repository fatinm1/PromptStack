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
    
    try {
      _prisma = new PrismaClient({
        log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
        errorFormat: 'pretty',
        // Explicitly set all required fields to avoid constructor issues
        datasources: {
          db: {
            url: process.env.DATABASE_URL
          }
        }
      })
      
      if (process.env.NODE_ENV !== 'production') {
        globalForPrisma.prisma = _prisma
      }
    } catch (error) {
      console.error('Failed to create Prisma client:', error)
      throw new Error(`Prisma client initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
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
    
    try {
      return getPrismaClient()[prop as keyof PrismaClient]
    } catch (error) {
      console.error('Prisma client access error:', error)
      // Return a mock function that logs the error
      return () => {
        console.error('Prisma client not available:', error)
        return Promise.resolve(null)
      }
    }
  }
})

export default prisma 