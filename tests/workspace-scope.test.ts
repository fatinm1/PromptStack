import { describe, it, expect } from 'vitest'
import { workspaceScope } from '../src/lib/workspace-scope'

describe('workspace isolation', () => {
  it('never expands membership for an explicit foreign workspace', () => {
    expect(workspaceScope(['owned'], 'foreign')).toEqual({ in: [] })
  })
  it('preserves only a requested member workspace', () => {
    expect(workspaceScope(['a', 'b'], 'b')).toEqual({ in: ['b'] })
  })
  it('uses memberships when no filter is supplied', () => {
    expect(workspaceScope(['a'], null)).toEqual({ in: ['a'] })
    expect(workspaceScope([], 'a')).toEqual({ in: [] })
  })
})
