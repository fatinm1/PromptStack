import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ testRuns: [] })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (!user) {
      return NextResponse.json({ testRuns: [] })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Verify user has access to this prompt
    const prompt = await prisma.prompt.findFirst({
      where: {
        id: params.id,
        project: {
          workspace: {
            members: { some: { userId: user.id } }
          }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json({ testRuns: [] })
    }

    const [testRuns, total] = await Promise.all([
      prisma.testRun.findMany({
        where: { promptId: params.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          prompt: {
            select: {
              name: true,
              version: true
            }
          }
        }
      }),
      prisma.testRun.count({
        where: { promptId: params.id }
      })
    ])

    const formattedTestRuns = testRuns.map(run => ({
      id: run.id,
      input: JSON.parse(run.input),
      output: run.output,
      tokensUsed: run.tokensUsed,
      cost: run.cost,
      latency: run.latency,
      model: run.model,
      provider: 'openai', // Default, could be stored in the future
      createdAt: run.createdAt.toISOString(),
      promptVersion: run.promptVersion
    }))

    return NextResponse.json({
      testRuns: formattedTestRuns,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Get test runs error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
} 