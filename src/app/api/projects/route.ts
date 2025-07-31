import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  workspaceId: z.string().min(1, 'Workspace ID is required')
})

const updateProjectSchema = createProjectSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const workspaceId = searchParams.get('workspaceId')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Get user's workspaces
    const userWorkspaces = await prisma.workspaceMember.findMany({
      where: { userId: session.user.id },
      select: { workspaceId: true }
    })

    const workspaceIds = userWorkspaces.map(w => w.workspaceId)

    // Build where clause
    const where: any = {
      workspaceId: { in: workspaceIds }
    }

    if (workspaceId) {
      where.workspaceId = workspaceId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [projects, total] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          workspace: {
            select: { name: true }
          },
          creator: {
            select: { name: true, email: true }
          },
          _count: {
            select: { prompts: true, datasets: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.project.count({ where })
    ])

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get projects error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = createProjectSchema.parse(body)

    // Verify user has access to the workspace
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: data.workspaceId,
        members: {
          some: { userId: session.user.id }
        }
      }
    })

    if (!workspace) {
      return NextResponse.json(
        { error: 'Workspace not found or access denied' },
        { status: 404 }
      )
    }

    const project = await prisma.project.create({
      data: {
        ...data,
        createdBy: session.user.id
      },
      include: {
        workspace: {
          select: { name: true }
        },
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create project error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 