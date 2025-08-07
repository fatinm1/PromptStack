import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import prisma from '@/lib/db'
import { llmService, type LLMConfig } from '@/lib/llm'

const runTestSchema = z.object({
  testInputs: z.array(z.string()).min(1, 'At least one test input is required'),
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
    const data = runTestSchema.parse(body)

    // Get the A/B test
    const abTest = await prisma.aBTest.findFirst({
      where: {
        id: params.id,
        OR: [
          {
            promptA: {
              project: {
                workspace: {
                  members: { some: { userId: user.id } }
                }
              }
            }
          },
          {
            promptB: {
              project: {
                workspace: {
                  members: { some: { userId: user.id } }
                }
              }
            }
          }
        ]
      },
      include: {
        promptA: true,
        promptB: true,
        results: true
      }
    })

    if (!abTest) {
      return NextResponse.json({ error: 'A/B test not found' }, { status: 404 })
    }

    // Update test status to running
    await prisma.aBTest.update({
      where: { id: params.id },
      data: { status: 'RUNNING' }
    })

    const results = []
    let totalCost = 0
    let totalTokens = 0
    let totalLatency = 0

    // Process each test input
    for (const testInput of data.testInputs) {
      const inputData = { test_input: testInput }

      // Test Prompt A
      const resultA = await llmService.testPrompt(
        abTest.promptA.content,
        inputData,
        {
          provider: data.provider || 'openai',
          model: data.model || abTest.promptA.model,
          temperature: data.temperature || abTest.promptA.temperature,
          maxTokens: data.maxTokens || abTest.promptA.maxTokens || undefined,
          apiKey: data.apiKey || process.env.OPENAI_API_KEY || ''
        }
      )

      // Test Prompt B
      const resultB = await llmService.testPrompt(
        abTest.promptB.content,
        inputData,
        {
          provider: data.provider || 'openai',
          model: data.model || abTest.promptB.model,
          temperature: data.temperature || abTest.promptB.temperature,
          maxTokens: data.maxTokens || abTest.promptB.maxTokens || undefined,
          apiKey: data.apiKey || process.env.OPENAI_API_KEY || ''
        }
      )

      // Determine winner based on response quality
      let winner = null
      let ratingA: number | null = null
      let ratingB: number | null = null

      // Simple quality scoring (in a real app, you'd use more sophisticated metrics)
      const scoreA = calculateResponseScore(resultA.output, testInput)
      const scoreB = calculateResponseScore(resultB.output, testInput)

      if (scoreA > scoreB) {
        winner = 'A'
        ratingA = scoreA
        ratingB = scoreB
      } else if (scoreB > scoreA) {
        winner = 'B'
        ratingA = scoreA
        ratingB = scoreB
      } else {
        winner = 'TIE'
        ratingA = scoreA
        ratingB = scoreB
      }

      // Save test result
      const testResult = await prisma.aBTestResult.create({
        data: {
          testId: params.id,
          input: testInput,
          outputA: resultA.output,
          outputB: resultB.output,
          winner,
          ratingA: ratingA || null,
          ratingB: ratingB || null,
          createdBy: user.id
        }
      })

      results.push(testResult)
      totalCost += resultA.cost + resultB.cost
      totalTokens += resultA.tokensUsed + resultB.tokensUsed
      totalLatency += resultA.latency + resultB.latency
    }

    // Calculate overall winner
    const aWins = results.filter(r => r.winner === 'A').length
    const bWins = results.filter(r => r.winner === 'B').length
    const ties = results.filter(r => r.winner === 'TIE').length

    let overallWinner = null
    if (aWins > bWins) {
      overallWinner = 'A'
    } else if (bWins > aWins) {
      overallWinner = 'B'
    } else {
      overallWinner = 'TIE'
    }

    // Update test status and add winner
    await prisma.aBTest.update({
      where: { id: params.id },
      data: { 
        status: 'COMPLETED',
        // Add winner field to schema if not exists
      }
    })

    return NextResponse.json({
      success: true,
      results,
      summary: {
        totalTests: results.length,
        aWins,
        bWins,
        ties,
        overallWinner,
        totalCost,
        totalTokens,
        averageLatency: totalLatency / results.length
      }
    })

  } catch (error) {
    console.error('Run A/B test error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Improved response quality scoring function
function calculateResponseScore(output: string, input: string): number {
  let score = 0
  
  // Base score for any response
  if (output.trim().length > 0) score += 1
  
  // Length score (prefer responses that aren't too short or too long)
  const length = output.length
  if (length > 20 && length < 1000) score += 2
  else if (length > 10 && length < 2000) score += 1
  
  // Relevance score (check if output contains words from input)
  const inputWords = input.toLowerCase().split(/\s+/)
  const outputLower = output.toLowerCase()
  const relevantWords = inputWords.filter(word => 
    word.length > 2 && outputLower.includes(word)
  ).length
  score += Math.min(relevantWords * 0.3, 2)
  
  // Structure score (prefer well-formatted responses)
  if (output.includes('\n') || output.includes('•') || output.includes('-') || output.includes('1.') || output.includes('2.') || output.includes('3.')) {
    score += 1
  }
  
  // Completeness score (prefer responses that seem complete)
  if (output.endsWith('.') || output.endsWith('!') || output.endsWith('?') || output.trim().length > 50) {
    score += 1
  }
  
  // Bonus for multiple options or structured responses
  if (output.includes('Option') || output.includes('1.') || output.includes('2.') || output.includes('3.')) {
    score += 1
  }
  
  return Math.min(score, 10) // Cap at 10
} 