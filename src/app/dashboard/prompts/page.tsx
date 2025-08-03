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

export default function PromptsPage() {
  const [prompts, setPrompts] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedPrompt, setSelectedPrompt] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchPrompts = async () => {
      try {
        setLoading(true)
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('userId')
        const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
        
        const response = await fetch('/api/prompts', { headers })
        if (response.ok) {
          const data = await response.json()
          setPrompts(data.prompts || [])
        }
      } catch (error) {
        console.error('Error fetching prompts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPrompts()
  }, [])

  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    prompt.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (prompt.tags && prompt.tags.split(',').some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
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

      {/* Loading State */}
      {loading && (
        <Card className="text-center py-16">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-muted-foreground animate-spin" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Loading prompts...</h3>
          </CardContent>
        </Card>
      )}

      {/* Prompts Grid */}
      {!loading && (
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
                {prompt.tags && (
                  <div className="flex flex-wrap gap-1">
                    {prompt.tags.split(',').map((tag: string, index: number) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-muted text-xs rounded-md"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

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
      )}

      {/* Empty State */}
      {!loading && filteredPrompts.length === 0 && (
        <Card className="text-center py-16 border-dashed border-2 border-muted-foreground/20">
          <CardContent>
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Code className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-3">No prompts yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Create your first prompt to start building AI applications. Prompts are the building blocks of your AI workflows.'
              }
            </p>
            <Button className="bg-gradient-to-r from-promptstack-primary to-promptstack-secondary">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Prompt
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
                initialContent={prompts.find((p: any) => p.id === selectedPrompt)?.content || ''}
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