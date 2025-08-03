'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PromptEditor } from '@/components/prompt-editor'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Save, 
  Play, 
  GitBranch, 
  BarChart3, 
  Settings,
  Code,
  History,
  TestTube,
  TrendingUp,
  Clock,
  User
} from 'lucide-react'

interface Prompt {
  id: string
  name: string
  description?: string
  content: string
  model: string
  temperature: number
  maxTokens: number
  tags: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  project: {
    name: string
    workspace: {
      name: string
    }
  }
  creator: {
    name: string
    email: string
  }
  _count: {
    testRuns: number
  }
  versions: Array<{
    id: string
    version: number
    content: string
    createdAt: string
    creator: {
      name: string
    }
  }>
}

interface TestRun {
  id: string
  input: string
  output: string
  tokensUsed: number
  cost: number
  latency: number
  rating?: number
  createdAt: string
}

export default function PromptDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [testing, setTesting] = useState(false)
  const [activeTab, setActiveTab] = useState('editor')
  const [testInput, setTestInput] = useState('')
  const [testResult, setTestResult] = useState<any>(null)
  const [testRuns, setTestRuns] = useState<TestRun[]>([])

  useEffect(() => {
    fetchPrompt()
    fetchTestRuns()
  }, [params.id])

  const fetchPrompt = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}`)
      if (response.ok) {
        const data = await response.json()
        setPrompt(data)
      } else {
        router.push('/dashboard/prompts')
      }
    } catch (error) {
      console.error('Error fetching prompt:', error)
      router.push('/dashboard/prompts')
    } finally {
      setLoading(false)
    }
  }

  const fetchTestRuns = async () => {
    try {
      const response = await fetch(`/api/prompts/${params.id}/test-runs`)
      if (response.ok) {
        const data = await response.json()
        setTestRuns(data.testRuns || [])
      }
    } catch (error) {
      console.error('Error fetching test runs:', error)
    }
  }

  const handleSave = async (content: string) => {
    if (!prompt) return

    setSaving(true)
    try {
      const response = await fetch(`/api/prompts/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content,
          name: prompt.name,
          description: prompt.description,
          tags: prompt.tags
        })
      })

      if (response.ok) {
        await fetchPrompt() // Refresh data
        alert('Prompt saved successfully!')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to save prompt')
      }
    } catch (error) {
      console.error('Error saving prompt:', error)
      alert('Failed to save prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!prompt || !testInput.trim()) {
      alert('Please enter test input')
      return
    }

    setTesting(true)
    try {
      const response = await fetch(`/api/prompts/${params.id}/test`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: testInput,
          variables: {}
        })
      })

      if (response.ok) {
        const result = await response.json()
        setTestResult(result)
        await fetchTestRuns() // Refresh test runs
      } else {
        const error = await response.json()
        alert(error.error || 'Test failed')
      }
    } catch (error) {
      console.error('Test error:', error)
      alert('Test failed. Please try again.')
    } finally {
      setTesting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading prompt...</p>
        </div>
      </div>
    )
  }

  if (!prompt) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Prompt not found</h2>
          <Button onClick={() => router.push('/dashboard/prompts')}>
            Back to Prompts
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{prompt.name}</h1>
            <p className="text-muted-foreground">
              {prompt.project.workspace.name} • {prompt.project.name}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={prompt.isActive ? "default" : "secondary"}>
            {prompt.isActive ? "Active" : "Inactive"}
          </Badge>
          <Button variant="outline" onClick={() => setActiveTab('test')}>
            <TestTube className="w-4 h-4 mr-2" />
            Test
          </Button>
          <Button onClick={() => handleSave(prompt.content)} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      {/* Prompt Info */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <Code className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Model:</span>
              <Badge variant="outline">{prompt.model}</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <TestTube className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Test Runs:</span>
              <span className="font-medium">{prompt._count.testRuns}</span>
            </div>
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Created by:</span>
              <span className="font-medium">{prompt.creator.name}</span>
            </div>
          </div>
          {prompt.tags.length > 0 && (
            <div className="flex items-center space-x-2 mt-4">
              <span className="text-sm text-muted-foreground">Tags:</span>
              <div className="flex space-x-1">
                {prompt.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="editor" className="flex items-center space-x-2">
            <Code className="w-4 h-4" />
            Editor
          </TabsTrigger>
          <TabsTrigger value="test" className="flex items-center space-x-2">
            <TestTube className="w-4 h-4" />
            Test
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center space-x-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
        </TabsList>

        {/* Editor Tab */}
        <TabsContent value="editor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Prompt Content</CardTitle>
              <CardDescription>
                Edit your prompt content. Use {{variable_name}} for dynamic content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptEditor
                initialContent={prompt.content}
                onSave={handleSave}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Test Tab */}
        <TabsContent value="test" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Test Input */}
            <Card>
              <CardHeader>
                <CardTitle>Test Input</CardTitle>
                <CardDescription>
                  Enter test data to see how your prompt performs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Input</label>
                  <textarea
                    value={testInput}
                    onChange={(e) => setTestInput(e.target.value)}
                    placeholder="Enter your test input..."
                    className="w-full h-32 p-3 border rounded-md resize-none"
                  />
                </div>
                <Button onClick={handleTest} disabled={testing || !testInput.trim()}>
                  <Play className="w-4 h-4 mr-2" />
                  {testing ? 'Running...' : 'Run Test'}
                </Button>
              </CardContent>
            </Card>

            {/* Test Result */}
            <Card>
              <CardHeader>
                <CardTitle>Test Result</CardTitle>
                <CardDescription>
                  Output from the latest test run
                </CardDescription>
              </CardHeader>
              <CardContent>
                {testResult ? (
                  <div className="space-y-4">
                    <div className="p-3 bg-muted rounded-md">
                      <p className="text-sm font-medium mb-2">Output:</p>
                      <p className="whitespace-pre-wrap">{testResult.content}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Tokens:</span>
                        <span className="ml-2 font-medium">{testResult.tokensUsed}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Cost:</span>
                        <span className="ml-2 font-medium">${testResult.cost.toFixed(4)}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Latency:</span>
                        <span className="ml-2 font-medium">{testResult.latency}ms</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Model:</span>
                        <span className="ml-2 font-medium">{testResult.model}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="w-8 h-8 mx-auto mb-2" />
                    <p>No test results yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Test Runs */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Test Runs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {testRuns.slice(0, 5).map((run) => (
                  <div key={run.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex-1">
                      <p className="text-sm font-medium truncate">{run.input}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(run.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span>{run.tokensUsed} tokens</span>
                      <span>${run.cost.toFixed(4)}</span>
                      <span>{run.latency}ms</span>
                    </div>
                  </div>
                ))}
                {testRuns.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <TestTube className="w-8 h-8 mx-auto mb-2" />
                    <p>No test runs yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
              <CardDescription>
                Previous versions of this prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {prompt.versions.map((version) => (
                  <div key={version.id} className="flex items-center justify-between p-3 border rounded-md">
                    <div className="flex items-center space-x-3">
                      <GitBranch className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Version {version.version}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(version.createdAt).toLocaleString()} • {version.creator.name}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                ))}
                {prompt.versions.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <History className="w-8 h-8 mx-auto mb-2" />
                    <p>No version history yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="w-4 h-4 mr-2" />
                  Total Tests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{prompt._count.testRuns}</p>
                <p className="text-sm text-muted-foreground">Test runs performed</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Avg Rating
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">4.2</p>
                <p className="text-sm text-muted-foreground">Average user rating</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Avg Latency
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">1.2s</p>
                <p className="text-sm text-muted-foreground">Average response time</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <p>Chart will be implemented here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 