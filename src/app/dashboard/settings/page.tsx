'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import { 
  User,
  Settings,
  Shield,
  Key,
  Bell,
  Palette,
  Database,
  Globe,
  Save,
  Eye,
  EyeOff
} from 'lucide-react'

interface UserSettings {
  name: string
  email: string
  avatar?: string
  notifications: {
    email: boolean
    browser: boolean
    weekly: boolean
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    language: string
    timezone: string
  }
  workspace: {
    name: string
    description: string
    defaultModel: string
    defaultTemperature: number
    maxTokens: number
  }
}

export default function SettingsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.avatar,
    notifications: {
      email: true,
      browser: true,
      weekly: false
    },
    preferences: {
      theme: 'system',
      language: 'en',
      timezone: 'UTC'
    },
    workspace: {
      name: 'My Workspace',
      description: 'Default workspace',
      defaultModel: 'gpt-3.5-turbo',
      defaultTemperature: 0.7,
      maxTokens: 4096
    }
  })
  const [loading, setLoading] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  useEffect(() => {
    if (user) {
      setSettings(prev => ({
        ...prev,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      }))
    }
  }, [user])

  const handleSave = async () => {
    setLoading(true)
    try {
      // In a real app, you'd save to the API
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Settings saved:', settings)
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setLoading(false)
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
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and workspace preferences
          </p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile Settings
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings(prev => ({ ...prev, email: e.target.value }))}
                placeholder="your@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar">Avatar URL</Label>
              <Input
                id="avatar"
                value={settings.avatar || ''}
                onChange={(e) => setSettings(prev => ({ ...prev, avatar: e.target.value }))}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </CardContent>
        </Card>

        {/* Workspace Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Workspace Settings
            </CardTitle>
            <CardDescription>
              Configure your workspace preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={settings.workspace.name}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  workspace: { ...prev.workspace, name: e.target.value }
                }))}
                placeholder="My Workspace"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={settings.workspace.description}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  workspace: { ...prev.workspace, description: e.target.value }
                }))}
                placeholder="Workspace description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="default-model">Default Model</Label>
              <select
                id="default-model"
                value={settings.workspace.defaultModel}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  workspace: { ...prev.workspace, defaultModel: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="gpt-4">GPT-4</option>
                <option value="claude-3">Claude-3</option>
                <option value="claude-2">Claude-2</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* API Configuration */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-4 w-4" />
              API Configuration
            </CardTitle>
            <CardDescription>
              Manage your API keys and settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai-key">OpenAI API Key</Label>
              <div className="relative">
                <Input
                  id="openai-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="anthropic-key">Anthropic API Key</Label>
              <div className="relative">
                <Input
                  id="anthropic-key"
                  type={showApiKey ? 'text' : 'password'}
                  placeholder="sk-ant-..."
                  className="pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="temperature">Default Temperature</Label>
              <Input
                id="temperature"
                type="number"
                min="0"
                max="2"
                step="0.1"
                value={settings.workspace.defaultTemperature}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  workspace: { ...prev.workspace, defaultTemperature: parseFloat(e.target.value) }
                }))}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </CardTitle>
            <CardDescription>
              Configure your notification preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive notifications via email
                </p>
              </div>
              <input
                id="email-notifications"
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, email: e.target.checked }
                }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="browser-notifications">Browser Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Show notifications in browser
                </p>
              </div>
              <input
                id="browser-notifications"
                type="checkbox"
                checked={settings.notifications.browser}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, browser: e.target.checked }
                }))}
                className="h-4 w-4"
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-reports">Weekly Reports</Label>
                <p className="text-sm text-muted-foreground">
                  Receive weekly performance reports
                </p>
              </div>
              <input
                id="weekly-reports"
                type="checkbox"
                checked={settings.notifications.weekly}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  notifications: { ...prev.notifications, weekly: e.target.checked }
                }))}
                className="h-4 w-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize your interface appearance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="theme">Theme</Label>
              <select
                id="theme"
                value={settings.preferences.theme}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, theme: e.target.value as 'light' | 'dark' | 'system' }
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <select
                id="language"
                value={settings.preferences.language}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, language: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <select
                id="timezone"
                value={settings.preferences.timezone}
                onChange={(e) => setSettings(prev => ({ 
                  ...prev, 
                  preferences: { ...prev.preferences, timezone: e.target.value }
                }))}
                className="w-full px-3 py-2 border border-input rounded-md bg-background"
              >
                <option value="UTC">UTC</option>
                <option value="America/New_York">Eastern Time</option>
                <option value="America/Chicago">Central Time</option>
                <option value="America/Denver">Mountain Time</option>
                <option value="America/Los_Angeles">Pacific Time</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Security
            </CardTitle>
            <CardDescription>
              Manage your account security
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full">
              Change Password
            </Button>
            <Button variant="outline" className="w-full">
              Enable Two-Factor Authentication
            </Button>
            <Button variant="outline" className="w-full">
              View Login History
            </Button>
            <Button variant="outline" className="w-full text-red-600">
              Delete Account
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 