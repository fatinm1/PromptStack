import { describe, it, expect, vi } from 'vitest'
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }))
vi.mock('../src/lib/auth', () => ({ authOptions: {} }))
import { getServerSession } from 'next-auth'
import { requestUserId } from '../src/lib/request-identity'

describe('verified session identity', () => {
  it('rejects a caller without a verified session', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null)
    expect(await requestUserId()).toBeNull()
  })
  it('uses only the server-verified session identity', async () => {
    vi.mocked(getServerSession).mockResolvedValue({ user: { id: 'verified' }, expires: '' })
    expect(await requestUserId()).toBe('verified')
  })
})
