import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import prisma from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { runPrompt } from '@/lib/llm'

const testRunSchema = z.object({
  input: z.record(z.any()),
  rating: z.number().min(1).max(5).optional(),
  feedback: z.string().optional()
})

export async function POST(
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
    const { input, rating, feedback } = testRunSchema.parse(body)

    // Get the prompt
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

    // Run the prompt
    const llmResponse = await runPrompt({
      content: prompt.content,
      variables: input,
      model: prompt.model,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
      topP: prompt.topP,
      frequencyPenalty: prompt.frequencyPenalty,
      presencePenalty: prompt.presencePenalty
    })

    // Save test run
    const testRun = await prisma.testRun.create({
      data: {
        promptId: params.id,
        promptVersion: prompt.version,
        input,
        output: llmResponse.content,
        model: llmResponse.model,
        tokensUsed: llmResponse.tokensUsed,
        cost: llmResponse.cost,
        latency: llmResponse.latency,
        rating,
        feedback,
        createdBy: session.user.id
      },
      include: {
        prompt: {
          select: {
            name: true,
            project: {
              select: {
                name: true,
                workspace: {
                  select: { name: true }
                }
              }
            }
          }
        }
      }
    })

    return NextResponse.json({
      ...testRun,
      llmResponse
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Test run error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(
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

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Verify access to prompt
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

    const [testRuns, total] = await Promise.all([
      prisma.testRun.findMany({
        where: { promptId: params.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          creator: {
            select: { name: true, email: true }
          }
        }
      }),
      prisma.testRun.count({
        where: { promptId: params.id }
      })
    ])

    return NextResponse.json({
      testRuns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get test runs error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 