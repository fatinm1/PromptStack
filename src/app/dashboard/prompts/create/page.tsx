'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { PromptEditor } from '@/components/prompt-editor'
import { 
  ArrowLeft,
  Save,
  Play,
  Settings,
  Code,
  FileText,
  Tag
} from 'lucide-react'

export default function CreatePromptPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [promptData, setPromptData] = useState({
    name: '',
    description: '',
    content: '',
    tags: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 4096
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!promptData.name.trim() || !promptData.content.trim()) {
      alert('Please fill in the name and content fields')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: promptData.name,
          description: promptData.description,
          content: promptData.content,
          tags: promptData.tags,
          model: promptData.model,
          temperature: promptData.temperature,
          maxTokens: promptData.maxTokens
        }),
      })

      if (response.ok) {
        const result = await response.json()
        router.push(`/dashboard/prompts/${result.prompt.id}`)
      } else {
        throw new Error('Failed to create prompt')
      }
    } catch (error) {
      console.error('Error creating prompt:', error)
      alert('Failed to create prompt. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!promptData.content.trim()) {
      alert('Please enter some prompt content')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/prompts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: promptData.content,
          model: promptData.model,
          temperature: promptData.temperature,
          maxTokens: promptData.maxTokens
        }),
      })

      if (response.ok) {
        const result = await response.json()
        alert(`Test completed! Response: ${result.output}`)
      } else {
        throw new Error('Test failed')
      }
    } catch (error) {
      console.error('Test error:', error)
      alert('Test failed. Please try again.')
    } finally {
      setLoading(false)
    }
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Prompt</h1>
            <p className="text-muted-foreground">
              Build and test your AI prompts
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={handleTest} disabled={loading}>
            <Play className="w-4 h-4 mr-2" />
            {loading ? 'Testing...' : 'Test Prompt'}
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Prompt'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 space-y-6">
          {/* Prompt Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Prompt Details
              </CardTitle>
              <CardDescription>
                Basic information about your prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={promptData.name}
                  onChange={(e) => setPromptData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter prompt name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={promptData.description}
                  onChange={(e) => setPromptData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this prompt does"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={promptData.tags}
                  onChange={(e) => setPromptData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="customer-support, responses, ai"
                />
              </div>
            </CardContent>
          </Card>

          {/* Prompt Editor */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-4 w-4" />
                Prompt Content
              </CardTitle>
              <CardDescription>
                Write your prompt with variables like {'{user_input}'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PromptEditor
                initialContent={promptData.content}
                onSave={(content) => setPromptData(prev => ({ ...prev, content }))}
                onTest={handleTest}
              />
            </CardContent>
          </Card>
        </div>

        {/* Settings Panel */}
        <div className="space-y-6">
          {/* Model Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Model Settings
              </CardTitle>
              <CardDescription>
                Configure the AI model parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <select
                  id="model"
                  value={promptData.model}
                  onChange={(e) => setPromptData(prev => ({ ...prev, model: e.target.value }))}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background"
                >
                  <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                  <option value="gpt-4">GPT-4</option>
                  <option value="claude-3">Claude-3</option>
                  <option value="claude-2">Claude-2</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="temperature">Temperature</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="temperature"
                    type="range"
                    min="0"
                    max="2"
                    step="0.1"
                    value={promptData.temperature}
                    onChange={(e) => setPromptData(prev => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                    className="flex-1"
                  />
                  <span className="text-sm font-medium w-12">
                    {promptData.temperature}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Higher values make output more creative, lower values make it more focused
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxTokens">Max Tokens</Label>
                <Input
                  id="maxTokens"
                  type="number"
                  min="1"
                  max="8192"
                  value={promptData.maxTokens}
                  onChange={(e) => setPromptData(prev => ({ ...prev, maxTokens: parseInt(e.target.value) }))}
                />
              </div>
            </CardContent>
          </Card>

          {/* Variables */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Variables
              </CardTitle>
              <CardDescription>
                Available variables in your prompt
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm">{'{user_input}'}</code>
                  <span className="text-xs text-muted-foreground">User input</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm">{'{context}'}</code>
                  <span className="text-xs text-muted-foreground">Context</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm">{'{tone}'}</code>
                  <span className="text-xs text-muted-foreground">Tone</span>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted rounded">
                  <code className="text-sm">{'{style}'}</code>
                  <span className="text-xs text-muted-foreground">Style</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="w-4 h-4 mr-2" />
                Save as Template
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Code className="w-4 h-4 mr-2" />
                Export Prompt
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Advanced Settings
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 