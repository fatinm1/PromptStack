'use client'

import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PromptEditor } from '@/components/prompt-editor'
import { 
  Code, 
  Plus, 
  Search, 
  GitBranch, 
  BarChart3, 
  Clock,
  Star,
  MoreVertical
} from 'lucide-react'

const mockPrompts = [
  {
    id: '1',
    name: 'Email Summarizer',
    description: 'Summarize long emails into concise bullet points',
    content: 'Summarize the following email in 3-5 bullet points: {{email_content}}',
    version: 3,
    model: 'gpt-4',
    temperature: 0.7,
    tags: ['email', 'summarization'],
    lastModified: '2024-01-15T10:30:00Z',
    testRuns: 45,
    avgRating: 4.2
  },
  {
    id: '2',
    name: 'Content Generator',
    description: 'Generate blog post content based on keywords',
    content: 'Write a blog post about {{topic}} with the following keywords: {{keywords}}',
    version: 2,
    model: 'gpt-3.5-turbo',
    temperature: 0.8,
    tags: ['content', 'blog'],
    lastModified: '2024-01-14T15:20:00Z',
    testRuns: 23,
    avgRating: 3.8
  },
  {
    id: '3',
    name: 'Code Assistant',
    description: 'Help with code review and suggestions',
    content: 'Review this code and suggest improvements: {{code}}',
    version: 1,
    model: 'gpt-4',
    temperature: 0.3,
    tags: ['code', 'review'],
    lastModified: '2024-01-13T09:15:00Z',
    testRuns: 67,
    avgRating: 4.5
  }
]

export default function PromptsPage() {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null)

  const filteredPrompts = mockPrompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage your LLM prompts
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search prompts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Prompts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPrompts.map((prompt) => (
          <Card 
            key={prompt.id} 
            className="card-hover cursor-pointer"
            onClick={() => setSelectedPrompt(prompt.id)}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center">
                    <Code className="w-4 h-4 mr-2 text-promptstack-primary" />
                    {prompt.name}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {prompt.description}
                  </CardDescription>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-muted text-xs rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <GitBranch className="h-4 w-4 text-muted-foreground" />
                    <span>v{prompt.version}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span>{prompt.testRuns} tests</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Star className="h-4 w-4 text-muted-foreground" />
                    <span>{prompt.avgRating}/5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(prompt.lastModified).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Model Info */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{prompt.model}</span>
                  <span>temp: {prompt.temperature}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {filteredPrompts.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <Code className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No prompts found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? 'Try adjusting your search terms.' : 'Create your first prompt to get started.'}
            </p>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Prompt
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Prompt Editor Modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border rounded-lg shadow-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <PromptEditor
                initialContent={mockPrompts.find(p => p.id === selectedPrompt)?.content || ''}
                onSave={(content) => {
                  console.log('Saving prompt:', content)
                  setSelectedPrompt(null)
                }}
                onTest={(content, variables) => {
                  console.log('Testing prompt:', content, variables)
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 