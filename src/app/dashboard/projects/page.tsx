'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { 
  Plus, 
  Search, 
  FolderOpen, 
  Users,
  Calendar,
  ArrowLeft
} from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  workspace: {
    name: string
  }
  creator: {
    name: string
    email: string
  }
  _count: {
    prompts: number
    datasets: number
  }
}

export default function ProjectsPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/projects')
      if (response.ok) {
        const data = await response.json()
        setProjects(data.projects || [])
      }
    } catch (error) {
      console.error('Error fetching projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleCreateProject = () => {
    router.push('/dashboard/projects/create')
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/dashboard/projects/${projectId}`)
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
            <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
            <p className="text-muted-foreground">
              Manage your prompt engineering projects
            </p>
          </div>
        </div>
        <Button onClick={handleCreateProject}>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-promptstack-primary"></div>
            <span className="text-sm text-muted-foreground">Loading projects...</span>
          </div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <Card 
              key={project.id} 
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleProjectClick(project.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="flex items-center">
                      <FolderOpen className="w-4 h-4 mr-2 text-promptstack-primary" />
                      {project.name}
                    </CardTitle>
                    <CardDescription className="mt-2">
                      {project.description || 'No description'}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{project._count.prompts} prompts</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Workspace */}
                  <div className="text-xs text-muted-foreground">
                    Workspace: {project.workspace.name}
                  </div>

                  {/* Creator */}
                  <div className="text-xs text-muted-foreground">
                    Created by: {project.creator.name}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <CardContent>
            <FolderOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No projects found' : 'No projects yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? 'Try adjusting your search terms.' 
                : 'Create your first project to get started.'
              }
            </p>
            <Button onClick={handleCreateProject}>
              <Plus className="mr-2 h-4 w-4" />
              Create Project
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 