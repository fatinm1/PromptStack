'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft,
  Save,
  Play,
  Code,
  Settings,
  Loader2,
  AlertCircle
} from 'lucide-react'

interface CreatePromptData {
  name: string
  description: string
  content: string
  model: string
  temperature: number
  maxTokens: number
  tags: string
  projectId: string
}

export default function CreatePromptPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [projects, setProjects] = useState<any[]>([])
  const [formData, setFormData] = useState<CreatePromptData>({
    name: '',
    description: '',
    content: '',
    model: 'gpt-3.5-turbo',
    temperature: 0.7,
    maxTokens: 1000,
    tags: '',
    projectId: ''
  })

  React.useEffect(() => {
    if (user) {
      loadProjects()
    }
  }, [user])

  const loadProjects = async () => {
    try {
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch('/api/projects', { headers })
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
        if (data.projects && data.projects.length > 0) {
          setFormData(prev => ({ ...prev, projectId: data.projects[0].id }))
        }
      }
    } catch (error) {
      console.error('Error loading projects:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim() || !formData.content.trim() || !formData.projectId) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setSaving(true)
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/dashboard/prompts/${data.id}/test`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create prompt')
      }
    } catch (error) {
      console.error('Error creating prompt:', error)
      alert('Failed to create prompt')
    } finally {
      setSaving(false)
    }
  }

  const handleTest = async () => {
    if (!formData.content.trim()) {
      alert('Please enter a prompt content first')
      return
    }

    // For now, just show a preview
    alert('Test functionality will be available after saving the prompt')
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/prompts')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Prompts
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Prompt</h1>
            <p className="text-muted-foreground">Create a new LLM prompt for your project</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Basic Information
              </CardTitle>
              <CardDescription>
                Set the name, description, and project for your prompt
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Prompt Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Email Generator, Code Assistant"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what this prompt does..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="project">Project *</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a project" />
                  </SelectTrigger>
                  <SelectContent>
                    {projects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {projects.length === 0 && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                      No projects available. Create a project first.
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => router.push('/dashboard/projects/create')}
                    >
                      Create Project
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="email, automation, customer-service"
                />
                <p className="text-xs text-muted-foreground">
                  Separate tags with commas
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Model Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                Model Configuration
              </CardTitle>
              <CardDescription>
                Configure the AI model and parameters
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => setFormData({ ...formData, model: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                    <SelectItem value="gpt-4">GPT-4</SelectItem>
                    <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                    <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Temperature: {formData.temperature}</Label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={formData.temperature}
                  onChange={(e) => setFormData({ ...formData, temperature: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Focused</span>
                  <span>Creative</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-tokens">Max Tokens</Label>
                <Input
                  id="max-tokens"
                  type="number"
                  value={formData.maxTokens}
                  onChange={(e) => setFormData({ ...formData, maxTokens: parseInt(e.target.value) })}
                  min="1"
                  max="4000"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Prompt Content */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt Content *</CardTitle>
            <CardDescription>
              Write your prompt. Use {'{{variable}}'} syntax for dynamic inputs.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="content">Prompt Template</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write a {{tone}} email to {{recipient} about {{subject}}..."
                rows={8}
                className="font-mono"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Use {'{{variable}}'} syntax for dynamic inputs
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleTest}
                >
                  <Play className="w-4 h-4 mr-2" />
                  Test Prompt
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/dashboard/prompts')}
          >
            Cancel
          </Button>
          <div className="flex items-center space-x-2">
            <Button
              type="submit"
              disabled={saving || !formData.name.trim() || !formData.content.trim() || !formData.projectId}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Prompt
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
} 