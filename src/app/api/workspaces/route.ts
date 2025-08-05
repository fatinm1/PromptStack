import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    // Get the user ID from the Authorization header
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ workspaces: [] })
    }

    const userId = authHeader.replace('Bearer ', '')
    
    // Verify the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!user) {
      return NextResponse.json({ workspaces: [] })
    }

    // Get the user's workspaces
    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: user.id }
        }
      },
      include: {
        creator: {
          select: { name: true, email: true }
        },
        _count: {
          select: { projects: true, members: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ workspaces })
  } catch (error) {
    console.error('Get workspaces error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 