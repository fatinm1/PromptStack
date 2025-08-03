'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Play, GitBranch, BarChart3 } from 'lucide-react'

interface Prompt {
  id: string
  name: string
  content: string
  model: string
  temperature: number
  version: number
}

export default function CreateABTestPage() {
  const router = useRouter()
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    promptAId: '',
    promptBId: '',
    testInputs: [''],
    status: 'DRAFT'
  })

  useEffect(() => {
    fetchPrompts()
  }, [])

  const fetchPrompts = async () => {
    try {
      const response = await fetch('/api/prompts')
      if (response.ok) {
        const data = await response.json()
        setPrompts(data.prompts || [])
      }
    } catch (error) {
      console.error('Error fetching prompts:', error)
    }
  }

  const handleSave = async () => {
    if (!formData.name || !formData.promptAId || !formData.promptBId) {
      alert('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/ab-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          promptAId: formData.promptAId,
          promptBId: formData.promptBId,
          testInputs: formData.testInputs.filter(input => input.trim()),
          status: formData.status
        })
      })

      if (response.ok) {
        const test = await response.json()
        router.push(`/dashboard/ab-testing/${test.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create A/B test')
      }
    } catch (error) {
      console.error('Error creating A/B test:', error)
      alert('Failed to create A/B test')
    } finally {
      setLoading(false)
    }
  }

  const addTestInput = () => {
    setFormData(prev => ({
      ...prev,
      testInputs: [...prev.testInputs, '']
    }))
  }

  const removeTestInput = (index: number) => {
    setFormData(prev => ({
      ...prev,
      testInputs: prev.testInputs.filter((_, i) => i !== index)
    }))
  }

  const updateTestInput = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      testInputs: prev.testInputs.map((input, i) => i === index ? value : input)
    }))
  }

  const selectedPromptA = prompts.find(p => p.id === formData.promptAId)
  const selectedPromptB = prompts.find(p => p.id === formData.promptBId)

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
            <h1 className="text-3xl font-bold tracking-tight">Create A/B Test</h1>
            <p className="text-muted-foreground">
              Compare two prompt versions to find the best performer
            </p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Creating...' : 'Create Test'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Test Information</CardTitle>
            <CardDescription>
              Basic details about your A/B test
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Test Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter test name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what you're testing"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prompt Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt Selection</CardTitle>
            <CardDescription>
              Choose the two prompts to compare
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="promptA">Prompt A (Control) *</Label>
                             <Select
                 value={formData.promptAId}
                 onValueChange={(value: string) => setFormData(prev => ({ ...prev, promptAId: value }))}
               >
                <SelectTrigger>
                  <SelectValue placeholder="Select prompt A" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name} (v{prompt.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="promptB">Prompt B (Variant) *</Label>
                             <Select
                 value={formData.promptBId}
                 onValueChange={(value: string) => setFormData(prev => ({ ...prev, promptBId: value }))}
               >
                <SelectTrigger>
                  <SelectValue placeholder="Select prompt B" />
                </SelectTrigger>
                <SelectContent>
                  {prompts.map((prompt) => (
                    <SelectItem key={prompt.id} value={prompt.id}>
                      {prompt.name} (v{prompt.version})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Prompt Previews */}
        <Card>
          <CardHeader>
            <CardTitle>Prompt A Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPromptA ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedPromptA.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedPromptA.model} • v{selectedPromptA.version}
                  </span>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="whitespace-pre-wrap">{selectedPromptA.content}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a prompt to preview</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Prompt B Preview</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedPromptB ? (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{selectedPromptB.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {selectedPromptB.model} • v{selectedPromptB.version}
                  </span>
                </div>
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p className="whitespace-pre-wrap">{selectedPromptB.content}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Select a prompt to preview</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Test Inputs */}
      <Card>
        <CardHeader>
          <CardTitle>Test Inputs</CardTitle>
          <CardDescription>
            Add the inputs you want to test both prompts with
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.testInputs.map((input, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => updateTestInput(index, e.target.value)}
                placeholder={`Test input ${index + 1}`}
                className="flex-1"
              />
              {formData.testInputs.length > 1 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeTestInput(index)}
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
          <Button variant="outline" onClick={addTestInput}>
            Add Test Input
          </Button>
        </CardContent>
      </Card>

      {/* Test Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Test Configuration</CardTitle>
          <CardDescription>
            Configure how the test will be run
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Test Status</Label>
                             <Select
                 value={formData.status}
                 onValueChange={(value: string) => setFormData(prev => ({ ...prev, status: value }))}
               >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="RUNNING">Running</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Distribution</Label>
              <Select defaultValue="50-50">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50-50">50% A / 50% B</SelectItem>
                  <SelectItem value="70-30">70% A / 30% B</SelectItem>
                  <SelectItem value="30-70">30% A / 70% B</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 