import { getServerSession } from 'next-auth'
import { authOptions } from './auth'

/** A caller-controlled user ID or Bearer header is never proof of identity. */
export async function requestUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions)
  return session?.user?.id || null
}

export { workspaceScope } from './workspace-scope'
