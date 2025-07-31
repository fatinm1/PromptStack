'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/components/theme-toggle'
import { TypingAnimation } from '@/components/typing-animation'
import { 
  Plus, 
  FolderOpen, 
  BarChart3, 
  Settings,
  LogOut
} from 'lucide-react'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">PromptStack Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              Welcome, {user.name}!
            </span>
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create New Project
              </CardTitle>
              <CardDescription>
                Start a new prompt engineering project
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" onClick={() => alert('Create project functionality coming soon!')}>
                Create Project
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FolderOpen className="w-5 h-5" />
                Open Projects
              </CardTitle>
              <CardDescription>
                View and manage your existing projects
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => alert('Project list coming soon!')}>
                View Projects
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Analytics
              </CardTitle>
              <CardDescription>
                View your prompt performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => alert('Analytics dashboard coming soon!')}>
                View Analytics
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure your workspace settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" onClick={() => alert('Settings panel coming soon!')}>
                Open Settings
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <div className="mt-8">
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
              <p className="text-sm text-muted-foreground mb-4">
                This is a demo version. In a full implementation, you would see:
              </p>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Your recent projects and prompts</li>
                <li>• Team collaboration features</li>
                <li>• A/B testing results</li>
                <li>• Performance analytics</li>
                <li>• Version control history</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
} 