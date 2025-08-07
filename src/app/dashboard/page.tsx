'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { TypingAnimation } from '@/components/typing-animation'
import { 
  Plus, 
  FolderOpen, 
  BarChart3, 
  Settings,
  Code,
  TrendingUp,
  Users
} from 'lucide-react'

interface Project {
  id: string
  name: string
  description?: string
  createdAt: string
  _count: {
    prompts: number
    datasets: number
  }
}

interface Analytics {
  totalPrompts: number
  totalTestRuns: number
  totalCost: number
  totalTokens: number
  averageLatency: number
  successRate: number
}

export default function DashboardPage() {
  const { user, isHydrated } = useAuth()
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user && isHydrated) {
      fetchDashboardData()
    }
  }, [user, isHydrated])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId')
      const headers: Record<string, string> = userId ? { 'Authorization': `Bearer ${userId}` } : {}
      
      const [projectsRes, analyticsRes] = await Promise.all([
        fetch('/api/projects', { headers }),
        fetch('/api/analytics', { headers })
      ])

      if (projectsRes.ok) {
        const projectsData = await projectsRes.json()
        setProjects(projectsData.projects || [])
      }

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = () => {
    router.push('/dashboard/projects/create')
  }

  const handleViewProjects = () => {
    router.push('/dashboard/projects')
  }

  const handleViewAnalytics = () => {
    router.push('/dashboard/analytics')
  }

  const handleOpenSettings = () => {
    router.push('/dashboard/settings')
  }

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
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
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-sm md:text-base text-muted-foreground">
          Here's what's happening with your prompts today.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Plus className="w-4 h-4" />
              Create New Project
            </CardTitle>
            <CardDescription>
              Start a new prompt engineering project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={handleCreateProject}>
              Create Project
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <FolderOpen className="w-4 h-4" />
              Open Projects
            </CardTitle>
            <CardDescription>
              View and manage your existing projects
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleViewProjects}>
              View Projects ({projects.length})
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </CardTitle>
            <CardDescription>
              View your prompt performance metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleViewAnalytics}>
              View Analytics
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="w-4 h-4" />
              Settings
            </CardTitle>
            <CardDescription>
              Configure your workspace settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full" onClick={handleOpenSettings}>
              Open Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Overview */}
      {analytics && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Prompts</p>
                    <p className="text-xl md:text-2xl font-bold">{analytics.totalPrompts}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BarChart3 className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Test Runs</p>
                    <p className="text-xl md:text-2xl font-bold">{analytics.totalTestRuns}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-xl md:text-2xl font-bold">{analytics.successRate.toFixed(1)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cost</p>
                    <p className="text-xl md:text-2xl font-bold">${analytics.totalCost.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Empty State for New Users */}
      {!loading && projects.length === 0 && (
        <div>
          <Card className="border-dashed border-2 border-muted-foreground/20">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">No projects yet</h3>
              <p className="text-muted-foreground mb-4">
                Get started by creating your first project to organize your prompts and datasets.
              </p>
              <Button onClick={handleCreateProject} className="bg-gradient-to-r from-promptstack-primary to-promptstack-secondary">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Project
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Projects */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-lg md:text-xl font-semibold mb-4">Recent Projects</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {projects.slice(0, 6).map((project) => (
              <Card key={project.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-base">{project.name}</CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{project._count.prompts} prompts</span>
                    <span>{project._count.datasets} datasets</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Welcome Message */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>
              <TypingAnimation 
                text="Welcome to PromptStack!" 
                speed={100}
                delay={200}
              />
            </CardTitle>
            <CardDescription>
              You're now ready to start building and managing your AI prompts with version control and collaboration features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-promptstack-primary"></div>
                <span className="ml-2 text-sm text-muted-foreground">Loading dashboard data...</span>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Your workspace is ready with:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Real-time prompt testing and evaluation</li>
                  <li>A/B testing with statistical analysis</li>
                  <li>Cost tracking and performance monitoring</li>
                  <li>Team collaboration features</li>
                  <li>Version control for prompts</li>
                </ul>
                {projects.length === 0 && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                    <p className="font-medium mb-2">🚀 Quick Start Guide:</p>
                    <ol className="list-decimal list-inside space-y-1 text-xs">
                      <li>Create your first project to organize prompts</li>
                      <li>Add prompts and test them with different inputs</li>
                      <li>Use A/B testing to compare prompt versions</li>
                      <li>Monitor costs and performance in Analytics</li>
                      <li>Invite team members to collaborate</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 