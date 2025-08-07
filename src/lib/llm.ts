import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'

export interface LLMConfig {
  provider: 'openai' | 'anthropic' | 'google' | 'meta' | 'mistral' | 'cohere'
  model: string
  temperature?: number
  maxTokens?: number
  apiKey: string
}

export interface LLMResponse {
  content: string
  tokensUsed: number
  cost: number
  latency: number
  model: string
  provider: string
  error?: string
}

export interface TestRun {
  promptId: string
  input: Record<string, any>
  output: string
  tokensUsed: number
  cost: number
  latency: number
  model: string
  provider: string
  rating?: number
  feedback?: string
  error?: string
}

// Cost per 1K tokens (approximate)
const COST_PER_1K_TOKENS = {
  // OpenAI Models
  'gpt-4o': { input: 0.005, output: 0.015 },
  'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
  'gpt-4-turbo': { input: 0.01, output: 0.03 },
  'gpt-4': { input: 0.03, output: 0.06 },
  'gpt-3.5-turbo': { input: 0.0015, output: 0.002 },
  
  // Anthropic Models
  'claude-3-5-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-5-haiku': { input: 0.00025, output: 0.00125 },
  'claude-3-opus': { input: 0.015, output: 0.075 },
  'claude-3-sonnet': { input: 0.003, output: 0.015 },
  'claude-3-haiku': { input: 0.00025, output: 0.00125 },
  
  // Google Models
  'gemini-1.5-pro': { input: 0.00375, output: 0.01875 },
  'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
  'gemini-pro': { input: 0.0005, output: 0.0015 },
  
  // Meta Models
  'llama-3.1-8b': { input: 0.0002, output: 0.0002 },
  'llama-3.1-70b': { input: 0.0007, output: 0.0008 },
  'llama-3.1-405b': { input: 0.0024, output: 0.006 },
  
  // Mistral Models
  'mistral-large': { input: 0.007, output: 0.024 },
  'mistral-medium': { input: 0.0027, output: 0.0081 },
  'mistral-small': { input: 0.0014, output: 0.0042 },
  
  // Cohere Models
  'command-r-plus': { input: 0.003, output: 0.015 },
  'command-r': { input: 0.0005, output: 0.0015 },
  'command-light': { input: 0.0001, output: 0.0006 }
}

export class LLMService {
  private openai: OpenAI | null = null
  private anthropic: Anthropic | null = null

  constructor() {}

  private initializeOpenAI(apiKey: string) {
    if (!this.openai) {
      this.openai = new OpenAI({
        apiKey
      })
    }
  }

  private initializeAnthropic(apiKey: string) {
    if (!this.anthropic) {
      this.anthropic = new Anthropic({
        apiKey
      })
    }
  }

  private calculateCost(
    provider: string,
    model: string,
    inputTokens: number,
    outputTokens: number
  ): number {
    const costs = COST_PER_1K_TOKENS[model as keyof typeof COST_PER_1K_TOKENS]
    if (!costs) {
      // Default cost if model not found
      return (inputTokens + outputTokens) * 0.001
    }

    const inputCost = (inputTokens / 1000) * costs.input
    const outputCost = (outputTokens / 1000) * costs.output
    return inputCost + outputCost
  }

  private async callOpenAI(
    prompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      this.initializeOpenAI(config.apiKey)
      
      const completion = await this.openai!.chat.completions.create({
        model: config.model,
        messages: [{ role: 'user', content: prompt }],
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1000,
      })

      const endTime = Date.now()
      const latency = endTime - startTime
      
      const inputTokens = completion.usage?.prompt_tokens || 0
      const outputTokens = completion.usage?.completion_tokens || 0
      const totalTokens = completion.usage?.total_tokens || 0
      
      const cost = this.calculateCost('openai', config.model, inputTokens, outputTokens)

      return {
        content: completion.choices[0]?.message?.content || '',
        tokensUsed: totalTokens,
        cost,
        latency,
        model: config.model,
        provider: 'openai'
      }
    } catch (error: any) {
      return {
        content: '',
        tokensUsed: 0,
        cost: 0,
        latency: Date.now() - startTime,
        model: config.model,
        provider: 'openai',
        error: error.message || 'OpenAI API error'
      }
    }
  }

  private async callAnthropic(
    prompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    const startTime = Date.now()
    
    try {
      this.initializeAnthropic(config.apiKey)
      
      const completion = await this.anthropic!.completions.create({
        model: config.model,
        max_tokens_to_sample: config.maxTokens || 1000,
        temperature: config.temperature || 0.7,
        prompt: `\n\nHuman: ${prompt}\n\nAssistant:`
      })

      const endTime = Date.now()
      const latency = endTime - startTime
      
      // Anthropic completions don't provide token usage in the response
      // We'll estimate based on input/output length
      const inputTokens = Math.ceil(prompt.length / 4) // Rough estimate
      const outputTokens = Math.ceil(completion.completion.length / 4) // Rough estimate
      const totalTokens = inputTokens + outputTokens
      
      const cost = this.calculateCost('anthropic', config.model, inputTokens, outputTokens)

      return {
        content: completion.completion || '',
        tokensUsed: totalTokens,
        cost,
        latency,
        model: config.model,
        provider: 'anthropic'
      }
    } catch (error: any) {
      return {
        content: '',
        tokensUsed: 0,
        cost: 0,
        latency: Date.now() - startTime,
        model: config.model,
        provider: 'anthropic',
        error: error.message || 'Anthropic API error'
      }
    }
  }

  async generateResponse(
    prompt: string,
    config: LLMConfig
  ): Promise<LLMResponse> {
    if (!config.apiKey) {
      return {
        content: '',
        tokensUsed: 0,
        cost: 0,
        latency: 0,
        model: config.model,
        provider: config.provider,
        error: 'API key is required'
      }
    }

    switch (config.provider) {
      case 'openai':
        return await this.callOpenAI(prompt, config)
      case 'anthropic':
        return await this.callAnthropic(prompt, config)
      default:
        return {
          content: '',
          tokensUsed: 0,
          cost: 0,
          latency: 0,
          model: config.model,
          provider: config.provider,
          error: 'Unsupported provider'
        }
    }
  }

  async testPrompt(
    promptTemplate: string,
    testInput: Record<string, any>,
    config: LLMConfig
  ): Promise<TestRun> {
    // Replace placeholders in the prompt template
    let processedPrompt = promptTemplate
    for (const [key, value] of Object.entries(testInput)) {
      const placeholder = `{{${key}}}`
      processedPrompt = processedPrompt.replace(new RegExp(placeholder, 'g'), String(value))
    }

    const response = await this.generateResponse(processedPrompt, config)

    return {
      promptId: '', // Will be set by the caller
      input: testInput,
      output: response.content,
      tokensUsed: response.tokensUsed,
      cost: response.cost,
      latency: response.latency,
      model: response.model,
      provider: response.provider,
      error: response.error
    }
  }

  getAvailableModels(provider: 'openai' | 'anthropic'): string[] {
    if (provider === 'openai') {
      return [
        'gpt-3.5-turbo',
        'gpt-4',
        'gpt-4-turbo',
        'gpt-4o',
        'gpt-4o-mini'
      ]
    } else {
      return [
        'claude-3-sonnet',
        'claude-3-opus',
        'claude-3-haiku',
        'claude-2.1',
        'claude-2.0'
      ]
    }
  }

  validateApiKey(provider: 'openai' | 'anthropic', apiKey: string): boolean {
    if (provider === 'openai') {
      return apiKey.startsWith('sk-') && apiKey.length > 20
    } else {
      return apiKey.startsWith('sk-ant-') && apiKey.length > 20
    }
  }
}

// Export a singleton instance
export const llmService = new LLMService() 