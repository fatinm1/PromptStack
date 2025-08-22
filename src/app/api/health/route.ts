import { NextResponse } from 'next/server'
import { getPrismaClient } from '@/lib/db'

export async function GET() {
  try {
    // Only check database if we're in runtime (not build time)
    let dbStatus = 'unknown'
    let dbError = null
    
    if (process.env.DATABASE_URL) {
      try {
        const prisma = getPrismaClient()
        // Check database connection with timeout
        await Promise.race([
          prisma.$queryRaw`SELECT 1`,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Database timeout')), 5000)
          )
        ])
        dbStatus = 'connected'
      } catch (error) {
        dbStatus = 'disconnected'
        dbError = error instanceof Error ? error.message : 'Unknown error'
      }
    }
    
    return NextResponse.json({
      status: dbStatus === 'connected' ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      database: dbStatus,
      error: dbError,
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }, { status: dbStatus === 'connected' ? 200 : 503 })
  } catch (error) {
    console.error('Health check failed:', error)
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      database: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      uptime: process.uptime()
    }, { status: 503 })
  }
}
