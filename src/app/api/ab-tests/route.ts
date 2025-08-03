import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const createABTestSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  promptAId: z.string().min(1, 'Prompt A ID is required'),
  promptBId: z.string().min(1, 'Prompt B ID is required'),
  promptAVersion: z.number().min(1, 'Prompt A version is required'),
  promptBVersion: z.number().min(1, 'Prompt B version is required'),
  testInputs: z.string().min(1, 'Test inputs are required')
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ abTests: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ abTests: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get user's workspaces
    const userWorkspaces = await prisma.workspaceMember.findMany({
      where: { userId: user.id },
      select: { workspaceId: true }
    })

    const workspaceIds = userWorkspaces.map(w => w.workspaceId)

    // Build where clause
    const where: any = {
      OR: [
        {
          promptA: {
            project: {
              workspaceId: { in: workspaceIds }
            }
          }
        },
        {
          promptB: {
            project: {
              workspaceId: { in: workspaceIds }
            }
          }
        }
      ]
    }

    if (workspaceId) {
      where.OR = [
        {
          promptA: {
            project: { workspaceId }
          }
        },
        {
          promptB: {
            project: { workspaceId }
          }
        }
      ]
    }

    if (status) {
      where.status = status
    }

    const [abTests, total] = await Promise.all([
      prisma.aBTest.findMany({
        where,
        include: {
          promptA: {
            select: {
              name: true,
              content: true,
              version: true
            }
          },
          promptB: {
            select: {
              name: true,
              content: true,
              version: true
            }
          },
          creator: {
            select: { name: true, email: true }
          },
          _count: {
            select: { results: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.aBTest.count({ where })
    ])

    return NextResponse.json({
      abTests,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get AB tests error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = createABTestSchema.parse(body)

    // Verify user has access to both prompts
    const [promptA, promptB] = await Promise.all([
      prisma.prompt.findFirst({
        where: {
          id: data.promptAId,
          project: {
            workspace: {
              members: {
                some: { userId: user.id }
              }
            }
          }
        }
      }),
      prisma.prompt.findFirst({
        where: {
          id: data.promptBId,
          project: {
            workspace: {
              members: {
                some: { userId: user.id }
              }
            }
          }
        }
      })
    ])

    if (!promptA || !promptB) {
      return NextResponse.json(
        { error: 'One or both prompts not found or access denied' },
        { status: 404 }
      )
    }

    const abTest = await prisma.aBTest.create({
      data: {
        ...data,
        createdBy: user.id
      },
      include: {
        promptA: {
          select: {
            name: true,
            content: true,
            version: true
          }
        },
        promptB: {
          select: {
            name: true,
            content: true,
            version: true
          }
        },
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(abTest, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create AB test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 