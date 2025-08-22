'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export function useNextAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = session?.user ? {
    id: session.user.id || '',
    name: session.user.name || '',
    email: session.user.email || '',
    avatar: session.user.image || undefined
  } : null

  const isHydrated = status !== 'loading'
  const isLoading = status === 'loading'

  const logout = async () => {
    await signOut({ redirect: false })
    router.push('/auth/signin')
  }

  return {
    user,
    isHydrated,
    isLoading,
    logout
  }
}
