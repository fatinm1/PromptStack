import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const workspaces = await prisma.workspace.findMany({
      where: {
        members: {
          some: { userId: session.user.id }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: { projects: true }
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