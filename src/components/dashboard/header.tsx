"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/components/auth-provider'
import { useRouter } from 'next/navigation'
import {
  Search,
  Bell,
  Plus,
  Settings,
  LogOut,
  User
} from 'lucide-react'

export function Header() {
  const router = useRouter()
  
  // Add error handling for useAuth
  let user = null
  let logout = () => {}
  let isHydrated = false
  
  try {
    const auth = useAuth()
    user = auth.user
    logout = auth.logout
    isHydrated = auth.isHydrated
  } catch (error) {
    console.warn('Auth context not available:', error)
  }

  const handleLogout = () => {
    logout()
    router.push('/auth/signin')
  }

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Don't render user-specific content until hydrated
  if (!isHydrated) {
    return (
      <header className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search prompts, tests, datasets..."
                className="pl-10"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* New Prompt */}
            <Button size="sm" className="gap-2 text-sm">
              <Plus className="h-4 w-4" />
              New Prompt
            </Button>

            {/* User Menu Placeholder */}
            <div className="relative group">
              <Button variant="ghost" size="sm" className="gap-2">
                <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium">U</span>
                </div>
                <span className="hidden md:inline">User</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <header className="bg-card border-b px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search prompts, tests, datasets..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <Button variant="ghost" size="sm" className="relative">
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
              3
            </span>
          </Button>

          {/* New Prompt */}
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            New Prompt
          </Button>

          {/* User Menu */}
          <div className="relative group">
            <Button variant="ghost" size="sm" className="gap-2">
              <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
                <span className="text-xs font-medium">
                  {user ? getUserInitials(user.name) : 'U'}
                </span>
              </div>
              <span className="hidden md:inline">
                {user ? user.name : 'User'}
              </span>
            </Button>
            
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              <div className="p-2 space-y-1">
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                  <User className="h-4 w-4" />
                  Profile
                </button>
                <button className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors">
                  <Settings className="h-4 w-4" />
                  Settings
                </button>
                <hr className="my-1" />
                <button
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
} 