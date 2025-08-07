'use client'

import React, { useState, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Play, 
  Save, 
  GitBranch, 
  Settings, 
  Code,
  Zap,
  Eye,
  EyeOff
} from 'lucide-react'

interface PromptEditorProps {
  initialContent?: string
  onSave?: (content: string) => void
  onTest?: (content: string, variables: Record<string, any>) => void
}

export function PromptEditor({ 
  initialContent = '', 
  onSave, 
  onTest 
}: PromptEditorProps) {
  const [content, setContent] = useState(initialContent)
  const [variables, setVariables] = useState<Record<string, any>>({})
  const [showVariables, setShowVariables] = useState(false)
  const [isRunning, setIsRunning] = useState(false)
  const editorRef = useRef<HTMLTextAreaElement>(null)

  const handleSave = () => {
    onSave?.(content)
  }

  const handleTest = async () => {
    if (!content.trim()) {
      alert('Please enter some prompt content')
      return
    }

    setIsRunning(true)
    try {
      // For now, we'll simulate the API call since we need a prompt ID
      // In a real implementation, this would call the actual LLM API
      const response = await fetch('/api/prompts/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          variables,
          model: 'gpt-3.5-turbo',
          temperature: 0.7
        }),
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Test result:', result)
        // You could display the result in a modal or toast
        alert('Test completed! Check console for results.')
      } else {
        const error = await response.json()
        alert(error.error || 'Test failed')
      }
    } catch (error) {
      console.error('Test error:', error)
      alert('Test failed. Please try again.')
    } finally {
      setIsRunning(false)
    }
  }

  const extractVariables = (text: string) => {
    const variableRegex = /\{\{([^}]+)\}\}/g
    const matches = text.match(variableRegex)
    if (!matches) return []
    
    return matches.map(match => 
      match.replace(/\{\{|\}\}/g, '')
    )
  }

  const variablesInContent = extractVariables(content)

  return (
    <div className="space-y-6">
      {/* Editor Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold">Prompt Editor</h2>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <GitBranch className="w-4 h-4 mr-2" />
              v1.2
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowVariables(!showVariables)}
          >
            {showVariables ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            Variables
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button size="sm" onClick={handleTest} disabled={isRunning}>
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? 'Running...' : 'Test'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Prompt Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <textarea
                  ref={editorRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full h-96 font-mono text-sm bg-background border border-border rounded-md p-4 resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  placeholder="Enter your prompt here... Use {{variable_name}} for dynamic content."
                />
                
                {/* Variable Highlighting */}
                {variablesInContent.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-muted-foreground">Variables:</span>
                    {variablesInContent.map((variable, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-promptstack-primary/10 text-promptstack-primary text-xs rounded-md font-mono"
                      >
                        {variable}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Variables Panel */}
        {showVariables && (
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Zap className="w-5 h-5 mr-2" />
                  Variables
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {variablesInContent.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No variables found. Use {'{{variable_name}}'} in your prompt to add variables.
                    </p>
                  ) : (
                    variablesInContent.map((variable, index) => (
                      <div key={index} className="space-y-2">
                        <label className="text-sm font-medium">{variable}</label>
                        <Input
                          value={variables[variable] || ''}
                          onChange={(e) => setVariables(prev => ({
                            ...prev,
                            [variable]: e.target.value
                          }))}
                          placeholder={`Enter value for ${variable}`}
                        />
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Test Output */}
      {isRunning && (
        <Card>
          <CardHeader>
            <CardTitle>Test Output</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-promptstack-primary"></div>
                <span className="text-sm text-muted-foreground">Running test...</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 