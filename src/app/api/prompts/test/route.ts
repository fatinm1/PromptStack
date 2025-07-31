import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { runPrompt } from '@/lib/llm'
import { authOptions } from '@/lib/auth'

const testPromptSchema = z.object({
  content: z.string().min(1, 'Content is required'),
  variables: z.record(z.any()).default({}),
  model: z.string().default('gpt-3.5-turbo'),
  temperature: z.number().min(0).max(2).default(0.7)
})

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
    const { content, variables, model, temperature } = testPromptSchema.parse(body)

    // Run the prompt with LLM
    const startTime = Date.now()
    const llmResponse = await runPrompt({
      content,
      variables,
      model,
      temperature
    })
    const latency = Date.now() - startTime

    return NextResponse.json({
      success: true,
      result: {
        content: llmResponse.content,
        tokensUsed: llmResponse.tokensUsed,
        cost: llmResponse.cost,
        latency: latency,
        model: llmResponse.model
      }
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Test prompt error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 