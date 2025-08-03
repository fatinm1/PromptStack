'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth-provider'
import { cn } from '@/lib/utils'
import {
  Code,
  ChevronLeft,
  ChevronRight,
  Plus,
  FolderOpen,
  BarChart3,
  GitBranch,
  Target,
  Database,
  Users,
  Settings
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: BarChart3,
  },
  {
    name: 'Prompts',
    href: '/dashboard/prompts',
    icon: Code,
  },
  {
    name: 'A/B Testing',
    href: '/dashboard/ab-testing',
    icon: GitBranch,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: Target,
  },
  {
    name: 'Datasets',
    href: '/dashboard/datasets',
    icon: Database,
  },
  {
    name: 'Team',
    href: '/dashboard/team',
    icon: Users,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = React.useState(false)
  
  // Add error handling for useAuth
  let user = null
  let isHydrated = false
  
  try {
    const auth = useAuth()
    user = auth.user
    isHydrated = auth.isHydrated
  } catch (error) {
    console.warn('Auth context not available:', error)
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-promptstack-primary to-promptstack-secondary rounded-lg flex items-center justify-center">
              <Code className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold gradient-text">PromptStack</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      {/* Workspace Selector */}
      {!collapsed && (
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Workspace
            </span>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Plus className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-muted rounded-md">
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">My Workspace</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "sidebar-item",
                isActive && "active",
                collapsed && "justify-center"
              )}
            >
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
              <span className="text-xs font-medium">
                {isHydrated && user ? getUserInitials(user.name) : 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {isHydrated && user ? user.name : 'User'}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {isHydrated && user ? user.email : 'user@example.com'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 