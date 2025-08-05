'use client'

import React, { useState, useEffect } from 'react'
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
  FolderPlus,
  Loader2
} from 'lucide-react'

interface CreateProjectData {
  name: string
  description: string
  workspaceId: string
}

interface Workspace {
  id: string
  name: string
  description?: string
}

export default function CreateProjectPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loadingWorkspaces, setLoadingWorkspaces] = useState(true)
  const [formData, setFormData] = useState<CreateProjectData>({
    name: '',
    description: '',
    workspaceId: ''
  })

  // Load user's workspaces
  useEffect(() => {
    const loadWorkspaces = async () => {
      try {
        const userId = localStorage.getItem('userId')
        const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
        
        const response = await fetch('/api/workspaces', { headers })
        if (response.ok) {
          const data = await response.json()
          setWorkspaces(data.workspaces || [])
        }
      } catch (error) {
        console.error('Error loading workspaces:', error)
      } finally {
        setLoadingWorkspaces(false)
      }
    }

    if (user) {
      loadWorkspaces()
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('Please enter a project name')
      return
    }

    if (!formData.workspaceId) {
      alert('Please select a workspace')
      return
    }

    try {
      setSaving(true)
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...headers
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        router.push('/dashboard/prompts/create')
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setSaving(false)
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
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/dashboard/projects')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Create New Project</h1>
            <p className="text-muted-foreground">Create a project to organize your prompts</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FolderPlus className="w-5 h-5 mr-2" />
              Project Information
            </CardTitle>
            <CardDescription>
              Set up your new project with a name and description
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace *</Label>
              <Select
                value={formData.workspaceId}
                onValueChange={(value) => setFormData({ ...formData, workspaceId: value })}
                disabled={loadingWorkspaces}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspaces.map((workspace) => (
                    <SelectItem key={workspace.id} value={workspace.id}>
                      {workspace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {loadingWorkspaces && (
                <p className="text-sm text-muted-foreground">Loading workspaces...</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Email Automation, Customer Support"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what this project is for..."
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/dashboard/projects')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={saving || !formData.name.trim() || !formData.workspaceId}
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
} 