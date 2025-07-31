import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { calculateTokenUsage, calculateCost } from './utils'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export interface LLMResponse {
  content: string
  tokensUsed: number
  cost: number
  latency: number
  model: string
}

export interface PromptRequest {
  content: string
  variables: Record<string, any>
  model: string
  temperature?: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
}

export async function runPrompt(request: PromptRequest): Promise<LLMResponse> {
  const startTime = Date.now()
  
  // Replace variables in prompt
  let processedContent = request.content
  for (const [key, value] of Object.entries(request.variables)) {
    processedContent = processedContent.replace(
      new RegExp(`{{${key}}}`, 'g'),
      String(value)
    )
  }

  try {
    let response: LLMResponse

    if (request.model.startsWith('gpt-')) {
      response = await runOpenAI(processedContent, request)
    } else if (request.model.startsWith('claude-')) {
      response = await runAnthropic(processedContent, request)
    } else {
      throw new Error(`Unsupported model: ${request.model}`)
    }

    const latency = Date.now() - startTime
    return {
      ...response,
      latency
    }
  } catch (error) {
    console.error('LLM error:', error)
    throw error
  }
}

async function runOpenAI(content: string, request: PromptRequest): Promise<LLMResponse> {
  const completion = await openai.chat.completions.create({
    model: request.model,
    messages: [{ role: 'user', content }],
    temperature: request.temperature || 0.7,
    max_tokens: request.maxTokens,
    top_p: request.topP,
    frequency_penalty: request.frequencyPenalty,
    presence_penalty: request.presencePenalty,
  })

  const responseContent = completion.choices[0]?.message?.content || ''
  const tokensUsed = completion.usage?.total_tokens || 0
  const cost = calculateCost(tokensUsed, request.model)

  return {
    content: responseContent,
    tokensUsed,
    cost,
    latency: 0, // Will be calculated by caller
    model: request.model
  }
}

async function runAnthropic(content: string, request: PromptRequest): Promise<LLMResponse> {
  const message = await anthropic.messages.create({
    model: request.model,
    max_tokens: request.maxTokens || 4096,
    temperature: request.temperature || 0.7,
    messages: [{ role: 'user', content }],
  })

  const responseContent = message.content[0]?.text || ''
  const tokensUsed = message.usage?.input_tokens + message.usage?.output_tokens || 0
  const cost = calculateCost(tokensUsed, request.model)

  return {
    content: responseContent,
    tokensUsed,
    cost,
    latency: 0, // Will be calculated by caller
    model: request.model
  }
}

export async function runABTest(
  promptA: string,
  promptB: string,
  testInput: string,
  model: string,
  temperature: number = 0.7
): Promise<{
  outputA: LLMResponse
  outputB: LLMResponse
}> {
  const [outputA, outputB] = await Promise.all([
    runPrompt({
      content: promptA,
      variables: { input: testInput },
      model,
      temperature
    }),
    runPrompt({
      content: promptB,
      variables: { input: testInput },
      model,
      temperature
    })
  ])

  return { outputA, outputB }
} 