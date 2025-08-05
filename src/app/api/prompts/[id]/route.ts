import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'

const updatePromptSchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  content: z.string().min(1, 'Content is required').optional(),
  description: z.string().optional(),
  tags: z.string().optional(),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().optional(),
  topP: z.number().optional(),
  frequencyPenalty: z.number().optional(),
  presencePenalty: z.number().optional(),
  isActive: z.boolean().optional()
})

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Try to get user ID from Bearer token first
    let userId: string | null = null
    const authHeader = request.headers.get('authorization')
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      userId = authHeader.replace('Bearer ', '')
    } else {
      // Fall back to NextAuth session
      const session = await getServerSession(authOptions)
      userId = session?.user?.id || null
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const prompt = await prisma.prompt.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId }
            }
          }
        }
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
        },
        versions: {
          orderBy: { version: 'desc' },
          take: 10
        },
        _count: {
          select: { testRuns: true }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ prompt })
  } catch (error) {
    console.error('Get prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const data = updatePromptSchema.parse(body)

    // Get current prompt
    const currentPrompt = await prisma.prompt.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!currentPrompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    // Create new version if content changed
    if (data.content && data.content !== currentPrompt.content) {
      await prisma.promptVersion.create({
        data: {
          promptId: params.id,
          version: currentPrompt.version + 1,
          content: currentPrompt.content,
          description: `Version ${currentPrompt.version}`,
          changes: 'Content updated',
          createdBy: session.user.id
        }
      })
    }

    // Update prompt
    const updatedPrompt = await prisma.prompt.update({
      where: { id: params.id },
      data: {
        ...data,
        version: data.content ? currentPrompt.version + 1 : currentPrompt.version,
        tags: data.tags || currentPrompt.tags
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

    return NextResponse.json(updatedPrompt)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Update prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check if user has access to the prompt
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: {
              some: { userId: session.user.id }
            }
          }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      )
    }

    // Soft delete by setting isActive to false
    await prisma.prompt.update({
      where: { id: params.id },
      data: { isActive: false }
    })

    return NextResponse.json({ message: 'Prompt deleted successfully' })
  } catch (error) {
    console.error('Delete prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 