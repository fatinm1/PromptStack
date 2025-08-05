import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { llmService, type LLMConfig } from '@/lib/llm'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

const testPromptSchema = z.object({
  input: z.record(z.any()),
  model: z.string().optional(),
  temperature: z.number().min(0).max(2).optional(),
  maxTokens: z.number().positive().optional(),
  provider: z.enum(['openai', 'anthropic']).optional(),
  apiKey: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const data = testPromptSchema.parse(body)

    // Get the prompt
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
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Get user's API keys from settings (in a real app, this would be stored securely)
    const userSettings = await prisma.user.findUnique({
      where: { id: userId },
      select: { 
        id: true,
        email: true,
        name: true
        // In a real app, you'd have a separate settings table
        // For now, we'll use the provided API key or environment variables
      }
    })

    // Determine which API key to use
    let apiKey = data.apiKey
    let provider = data.provider || 'openai'
    let model = data.model || prompt.model || 'gpt-3.5-turbo'

    if (!apiKey) {
      // In a real app, you'd get this from user settings
      apiKey = process.env[provider === 'openai' ? 'OPENAI_API_KEY' : 'ANTHROPIC_API_KEY'] || ''
    }

    if (!apiKey) {
      return NextResponse.json({ 
        error: 'API key is required. Please provide an API key or configure it in your settings.' 
      }, { status: 400 })
    }

    // Validate API key format
    if (!llmService.validateApiKey(provider as 'openai' | 'anthropic', apiKey)) {
      return NextResponse.json({ 
        error: 'Invalid API key format' 
      }, { status: 400 })
    }

    const llmConfig: LLMConfig = {
      provider: provider as 'openai' | 'anthropic',
      model,
      temperature: data.temperature || prompt.temperature || 0.7,
      maxTokens: data.maxTokens || prompt.maxTokens || 1000,
      apiKey
    }

    // Test the prompt
    const testRun = await llmService.testPrompt(
      prompt.content,
      data.input,
      llmConfig
    )

    // Save the test run to the database
    const savedTestRun = await prisma.testRun.create({
      data: {
        promptId: prompt.id,
        input: JSON.stringify(data.input),
        output: testRun.output,
        tokensUsed: testRun.tokensUsed,
        cost: testRun.cost,
        latency: testRun.latency,
        model: testRun.model,
        promptVersion: prompt.version,
        createdBy: user.id
      }
    })

    return NextResponse.json({
      testRun: {
        id: savedTestRun.id,
        input: data.input,
        output: testRun.output,
        tokensUsed: testRun.tokensUsed,
        cost: testRun.cost,
        latency: testRun.latency,
        model: testRun.model,
        provider: testRun.provider,
        error: testRun.error,
        createdAt: savedTestRun.createdAt
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.errors }, { status: 400 })
    }
    console.error('Test prompt error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const userId = authHeader.replace('Bearer ', '')
    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      select: { id: true, email: true, name: true }
    })
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
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
              some: { userId: user.id }
            }
          }
        }
      }
    })

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt not found or access denied' },
        { status: 404 }
      )
    }

    const [testRuns, total] = await Promise.all([
      prisma.testRun.findMany({
        where: { promptId: params.id },
        include: {
          creator: {
            select: { name: true, email: true }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.testRun.count({ where: { promptId: params.id } })
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