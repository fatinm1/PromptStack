export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'member' | 'viewer'
  createdAt: Date
}

export interface Project {
  id: string
  name: string
  description?: string
  workspaceId: string
  createdAt: Date
  updatedAt: Date
  members: User[]
}

export interface Prompt {
  id: string
  name: string
  content: string
  description?: string
  projectId: string
  version: number
  tags: string[]
  model: string
  temperature: number
  maxTokens?: number
  topP?: number
  frequencyPenalty?: number
  presencePenalty?: number
  variables: PromptVariable[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
}

export interface PromptVariable {
  name: string
  description?: string
  type: 'string' | 'number' | 'boolean' | 'array'
  required: boolean
  defaultValue?: string
}

export interface PromptVersion {
  id: string
  promptId: string
  version: number
  content: string
  description?: string
  createdAt: Date
  createdBy: string
  changes: string[]
}

export interface TestRun {
  id: string
  promptId: string
  promptVersion: number
  input: Record<string, any>
  output: string
  model: string
  tokensUsed: number
  cost: number
  latency: number
  rating?: number
  feedback?: string
  createdAt: Date
  createdBy: string
}

export interface ABTest {
  id: string
  name: string
  description?: string
  promptAId: string
  promptBId: string
  promptAVersion: number
  promptBVersion: number
  testInputs: string[]
  results: ABTestResult[]
  status: 'draft' | 'running' | 'completed'
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface ABTestResult {
  id: string
  testId: string
  input: string
  outputA: string
  outputB: string
  winner: 'A' | 'B' | 'tie' | null
  ratingA?: number
  ratingB?: number
  feedback?: string
  createdAt: Date
  createdBy: string
}

export interface Dataset {
  id: string
  name: string
  description?: string
  projectId: string
  items: DatasetItem[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
}

export interface DatasetItem {
  id: string
  datasetId: string
  input: Record<string, any>
  expectedOutput?: string
  tags: string[]
  createdAt: Date
}

export interface Workspace {
  id: string
  name: string
  description?: string
  members: User[]
  settings: WorkspaceSettings
  createdAt: Date
  updatedAt: Date
}

export interface WorkspaceSettings {
  defaultModel: string
  defaultTemperature: number
  maxTokens: number
  allowedModels: string[]
  costLimit?: number
  tokenLimit?: number
}

export interface Analytics {
  totalPrompts: number
  totalTestRuns: number
  totalCost: number
  totalTokens: number
  averageLatency: number
  successRate: number
  topModels: Array<{ model: string; usage: number }>
  costByDate: Array<{ date: string; cost: number }>
  tokenUsageByDate: Array<{ date: string; tokens: number }>
}

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  createdAt: Date
  read: boolean
}

export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3' | 'claude-2' | 'llama-2' | 'mistral'

export interface ModelConfig {
  name: string
  type: ModelType
  maxTokens: number
  inputCost: number
  outputCost: number
  available: boolean
} 