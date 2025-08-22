'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useSession, signIn, signOut, getSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  signup: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  isHydrated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (status === 'loading') {
      setIsLoading(true)
      return
    }

    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id || '',
        name: session.user.name || '',
        email: session.user.email || '',
        avatar: session.user.image || undefined
      })
    } else {
      setUser(null)
    }

    setIsLoading(false)
    setIsHydrated(true)
  }, [session, status])

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      // Session will be updated automatically by NextAuth
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const signup = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        // After successful signup, sign in automatically
        await signIn('credentials', {
          email,
          password,
          redirect: false,
        })
      } else {
        throw new Error(data.message || 'Signup failed')
      }
    } catch (error) {
      console.error('Signup error:', error)
      throw error
    }
  }

  const logout = async () => {
    await signOut({ redirect: false })
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading, isHydrated }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 