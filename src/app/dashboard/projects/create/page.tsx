'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { 
  ArrowLeft,
  Save,
  FolderOpen
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Workspace {
  id: string
  name: string
  description?: string
}

export default function CreateProjectPage() {
  const router = useRouter()
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workspaceId: ''
  })

  useEffect(() => {
    fetchWorkspaces()
  }, [])

  const fetchWorkspaces = async () => {
    try {
      const response = await fetch('/api/workspaces')
      if (response.ok) {
        const data = await response.json()
        setWorkspaces(data.workspaces || [])
        if (data.workspaces?.length > 0) {
          setFormData(prev => ({ ...prev, workspaceId: data.workspaces[0].id }))
        }
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.workspaceId) {
      alert('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        const project = await response.json()
        router.push(`/dashboard/projects/${project.id}`)
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to create project')
      }
    } catch (error) {
      console.error('Error creating project:', error)
      alert('Failed to create project')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create New Project</h1>
          <p className="text-muted-foreground">
            Start a new prompt engineering project
          </p>
        </div>
      </div>

      {/* Form */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FolderOpen className="w-5 h-5 mr-2" />
            Project Details
          </CardTitle>
          <CardDescription>
            Fill in the details for your new project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Project Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter project name"
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your project (optional)"
                rows={3}
              />
            </div>

            {/* Workspace */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Workspace *</label>
              <select
                value={formData.workspaceId}
                onChange={(e) => handleInputChange('workspaceId', e.target.value)}
                className="w-full p-2 border border-input rounded-md bg-background"
                required
              >
                <option value="">Select a workspace</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || !formData.name || !formData.workspaceId}
              >
                <Save className="w-4 h-4 mr-2" />
                {loading ? 'Creating...' : 'Create Project'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 