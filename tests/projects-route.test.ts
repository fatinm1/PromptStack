import { beforeEach, it, expect, vi } from 'vitest'
import { NextRequest } from 'next/server'
vi.mock('../src/lib/request-identity', () => ({ requestUserId: vi.fn(), workspaceScope: (ids: string[], requested: string | null) => ({ in: requested ? ids.filter(id => id === requested) : ids }) }))
vi.mock('../src/lib/db', () => ({ default: { user: { findUnique: vi.fn() }, workspaceMember: { findMany: vi.fn() }, project: { findMany: vi.fn(), count: vi.fn() } } }))
import { requestUserId } from '../src/lib/request-identity'
import prisma from '../src/lib/db'
import { GET } from '../src/app/api/projects/route'

beforeEach(() => vi.resetAllMocks())
it('a forged Bearer identity cannot replace a session', async () => {
  vi.mocked(requestUserId).mockResolvedValue(null)
  const res = await GET(new NextRequest('http://localhost/api/projects', { headers: { Authorization: 'Bearer victim' } }))
  expect(res.status).toBe(401)
  expect(prisma.user.findUnique).not.toHaveBeenCalled()
})
it('foreign workspace filters remain outside the query scope', async () => {
  vi.mocked(requestUserId).mockResolvedValue('me')
  vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'me' } as any)
  vi.mocked(prisma.workspaceMember.findMany).mockResolvedValue([{ workspaceId: 'owned' }] as any)
  vi.mocked(prisma.project.findMany).mockResolvedValue([])
  vi.mocked(prisma.project.count).mockResolvedValue(0)
  const res = await GET(new NextRequest('http://localhost/api/projects?workspaceId=foreign'))
  expect(res.status).toBe(200)
  expect(prisma.project.findMany).toHaveBeenCalledWith(expect.objectContaining({ where: { workspaceId: { in: [] } } }))
})
