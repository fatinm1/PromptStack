'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { 
  Play,
  Save,
  History,
  Settings,
  Zap,
  Clock,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Loader2,
  Copy,
  Star
} from 'lucide-react'

interface TestResult {
  id: string
  input: Record<string, any>
  output: string
  tokensUsed: number
  cost: number
  latency: number
  model: string
  provider: string
  error?: string
  createdAt: string
}

interface Prompt {
  id: string
  name: string
  description: string
  content: string
  model: string
  temperature: number
  maxTokens: number
  tags: string
}

export default function PromptTestPage({ params }: { params: { id: string } }) {
  const { user } = useAuth()
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [testing, setTesting] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [testHistory, setTestHistory] = useState<TestResult[]>([])
  const [selectedModel, setSelectedModel] = useState('')
  const [selectedProvider, setSelectedProvider] = useState<'openai' | 'anthropic'>('openai')
  const [temperature, setTemperature] = useState(0.7)
  const [maxTokens, setMaxTokens] = useState(1000)
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (user) {
      loadPrompt()
      loadTestHistory()
    }
  }, [user, params.id])

  const loadPrompt = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/prompts/${params.id}`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPrompt(data.prompt)
        setSelectedModel(data.prompt.model)
        setTemperature(data.prompt.temperature)
        setMaxTokens(data.prompt.maxTokens)
      }
    } catch (error) {
      console.error('Error loading prompt:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTestHistory = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}/test-runs`, {
        headers: {
          'Authorization': `Bearer ${user?.id}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setTestHistory(data.testRuns || [])
      }
    } catch (error) {
      console.error('Error loading test history:', error)
    }
  }

  const extractVariables = (content: string): string[] => {
    const regex = /\{\{([^}]+)\}\}/g
    const variables: string[] = []
    let match
    
    while ((match = regex.exec(content)) !== null) {
      variables.push(match[1])
    }
    
    return [...new Set(variables)] // Remove duplicates
  }

  const parseTestInput = (input: string): Record<string, any> => {
    try {
      return JSON.parse(input)
    } catch {
      // If not valid JSON, try to parse as key-value pairs
      const result: Record<string, any> = {}
      const lines = input.split('\n')
      
      for (const line of lines) {
        const [key, value] = line.split(':').map(s => s.trim())
        if (key && value) {
          result[key] = value
        }
      }
      
      return result
    }
  }

  const handleTest = async () => {
    if (!prompt || !testInput.trim()) return

    try {
      setTesting(true)
      setTestResult(null)

      const inputData = parseTestInput(testInput)
      
      const response = await fetch(`/api/prompts/${params.id}/test`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`
        },
        body: JSON.stringify({
          input: inputData,
          model: selectedModel,
          temperature,
          maxTokens,
          provider: selectedProvider,
          apiKey: apiKey || undefined
        })
      })

      if (response.ok) {
        const data = await response.json()
        setTestResult(data.testRun)
        loadTestHistory() // Refresh history
      } else {
        const error = await response.json()
        setTestResult({
          id: '',
          input: inputData,
          output: '',
          tokensUsed: 0,
          cost: 0,
          latency: 0,
          model: selectedModel,
          provider: selectedProvider,
          error: error.error || 'Test failed',
          createdAt: new Date().toISOString()
        })
      }
    } catch (error) {
      console.error('Error testing prompt:', error)
      setTestResult({
        id: '',
        input: {},
        output: '',
        tokensUsed: 0,
        cost: 0,
        latency: 0,
        model: selectedModel,
        provider: selectedProvider,
        error: 'Network error',
        createdAt: new Date().toISOString()
      })
    } finally {
      setTesting(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(4)}`
  }

  const formatLatency = (latency: number) => {
    return `${latency}ms`
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to continue</h1>
          <Button onClick={() => router.push('/auth/signin')}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Test Prompt</h1>
            <p className="text-muted-foreground">Test your prompt with real AI models</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <Loader2 className="w-8 h-8 text-muted-foreground animate-spin mx-auto mb-4" />
              <p>Loading prompt...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Prompt Not Found</h1>
            <p className="text-muted-foreground">The prompt you're looking for doesn't exist</p>
          </div>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center py-16">
            <div className="text-center">
              <AlertCircle className="w-8 h-8 text-muted-foreground mx-auto mb-4" />
              <p>Prompt not found or you don't have access to it.</p>
              <Button onClick={() => router.push('/dashboard/prompts')} className="mt-4">
                Back to Prompts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const variables = extractVariables(prompt.content)
  const exampleInput = variables.reduce((acc, variable) => {
    acc[variable] = `example_${variable}`
    return acc
  }, {} as Record<string, string>)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Test Prompt</h1>
          <p className="text-muted-foreground">Test "{prompt.name}" with real AI models</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => router.push(`/dashboard/prompts/${params.id}`)}>
            <History className="w-4 h-4 mr-2" />
            View Prompt
          </Button>
          <Button variant="outline" onClick={() => router.push('/dashboard/settings')}>
            <Settings className="w-4 h-4 mr-2" />
            API Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Test Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Test Configuration
            </CardTitle>
            <CardDescription>
              Configure your test parameters and API settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Provider Selection */}
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select value={selectedProvider} onValueChange={(value: 'openai' | 'anthropic') => setSelectedProvider(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Model</Label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {selectedProvider === 'openai' ? (
                    <>
                      <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      <SelectItem value="gpt-4">GPT-4</SelectItem>
                      <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                      <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                      <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                      <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Temperature */}
            <div className="space-y-2">
              <Label>Temperature: {temperature}</Label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Focused</span>
                <span>Creative</span>
              </div>
            </div>

            {/* Max Tokens */}
            <div className="space-y-2">
              <Label htmlFor="max-tokens">Max Tokens</Label>
              <Input
                id="max-tokens"
                type="number"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                min="1"
                max="4000"
              />
            </div>

            {/* API Key */}
            <div className="space-y-2">
              <Label>API Key (Optional)</Label>
              <div className="relative">
                <Input
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder={`Enter your ${selectedProvider} API key`}
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? 'Hide' : 'Show'}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Leave empty to use your saved API key from settings
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Input */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Test Input
            </CardTitle>
            <CardDescription>
              Provide input values for your prompt variables
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {variables.length > 0 ? (
              <>
                <div className="space-y-2">
                  <Label>Input Variables</Label>
                  <p className="text-sm text-muted-foreground">
                    Found variables: {variables.join(', ')}
                  </p>
                </div>
                <div className="space-y-2">
                  <Label>Input Data (JSON or key:value format)</Label>
                  <Textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder={JSON.stringify(exampleInput, null, 2)}
                    rows={8}
                  />
                </div>
                <Button
                  onClick={() => setTestInput(JSON.stringify(exampleInput, null, 2))}
                  variant="outline"
                  size="sm"
                >
                  Load Example
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Label>No Variables Found</Label>
                <p className="text-sm text-muted-foreground">
                  Your prompt doesn't contain any variables ({{variable}}). You can still test it.
                </p>
                <Textarea
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Add any additional context here..."
                  rows={4}
                />
              </div>
            )}

            <Button 
              onClick={handleTest} 
              disabled={testing || !testInput.trim()}
              className="w-full"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 mr-2" />
                  Test Prompt
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Test Result */}
        {testResult && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                {testResult.error ? (
                  <AlertCircle className="w-5 h-5 mr-2 text-red-500" />
                ) : (
                  <CheckCircle className="w-5 h-5 mr-2 text-green-500" />
                )}
                Test Result
              </CardTitle>
              <CardDescription>
                {testResult.error ? 'Test failed' : 'Test completed successfully'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {testResult.error ? (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">Error: {testResult.error}</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>Output</Label>
                    <div className="relative">
                      <Textarea
                        value={testResult.output}
                        readOnly
                        rows={6}
                        className="font-mono text-sm"
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2"
                        onClick={() => copyToClipboard(testResult.output)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Latency</p>
                        <p className="text-xs text-muted-foreground">{formatLatency(testResult.latency)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Cost</p>
                        <p className="text-xs text-muted-foreground">{formatCost(testResult.cost)}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Tokens</p>
                        <p className="text-xs text-muted-foreground">{testResult.tokensUsed}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">Model</p>
                        <p className="text-xs text-muted-foreground">{testResult.model}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}

        {/* Test History */}
        {testHistory.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="w-5 h-5 mr-2" />
                Test History
              </CardTitle>
              <CardDescription>
                Recent test runs for this prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {testHistory.slice(0, 5).map((test) => (
                  <div key={test.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">
                        {test.output.substring(0, 100)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(test.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{formatCost(test.cost)}</span>
                      <span>{formatLatency(test.latency)}</span>
                      <span>{test.tokensUsed} tokens</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 