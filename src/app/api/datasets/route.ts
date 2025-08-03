import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const createDatasetSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  type: z.string().default('test'),
  tags: z.string().default('')
})

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ datasets: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ datasets: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
    }

    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const search = searchParams.get('search')
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
      project: {
        workspaceId: { in: workspaceIds }
      }
    }

    if (projectId) {
      where.projectId = projectId
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { contains: search, mode: 'insensitive' } }
      ]
    }

    const [datasets, total] = await Promise.all([
      prisma.dataset.findMany({
        where,
        include: {
          project: {
            select: {
              name: true,
              workspace: {
                select: { name: true }
              }
            }
          },
          creator: {
            select: { name: true, email: true }
          },
          _count: {
            select: { items: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.dataset.count({ where })
    ])

    return NextResponse.json({
      datasets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get datasets error:', error)
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
    const data = createDatasetSchema.parse(body)

    // Verify user has access to the project
    const project = await prisma.project.findFirst({
      where: {
        id: data.projectId,
        workspace: {
          members: {
            some: { userId: user.id }
          }
        }
      }
    })

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found or access denied' },
        { status: 404 }
      )
    }

    const dataset = await prisma.dataset.create({
      data: {
        ...data,
        createdBy: user.id
      },
      include: {
        project: {
          select: {
            name: true,
            workspace: {
              select: { name: true }
            }
          }
        },
        creator: {
          select: { name: true, email: true }
        }
      }
    })

    return NextResponse.json(dataset, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create dataset error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 