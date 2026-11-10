import { requestUserId } from '@/lib/request-identity'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'

const createPromptSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  content: z.string().min(1, 'Content is required'),
  description: z.string().optional(),
  projectId: z.string().min(1, 'Project ID is required'),
  tags: z.string().default(''),
  model: z.string().default('gpt-3.5-turbo'),
  temperature: z.number().min(0).max(2).default(0.7),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
  frequencyPenalty: z.number().optional(),
  presencePenalty: z.number().optional()
})

const updatePromptSchema = createPromptSchema.partial()

export async function GET(request: NextRequest) {
  try {
    const userId = await requestUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ prompts: [], pagination: { page: 1, limit: 10, total: 0, pages: 0 } })
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
        { tags: { hasSome: [search] } }
      ]
    }

    const [prompts, total] = await Promise.all([
      prisma.prompt.findMany({
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
            select: { testRuns: true }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.prompt.count({ where })
    ])

    return NextResponse.json({
      prompts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get prompts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await requestUserId()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const body = await request.json()
    const data = createPromptSchema.parse(body)

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

    const prompt = await prisma.prompt.create({
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

    return NextResponse.json(prompt, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Create prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 