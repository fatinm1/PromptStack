/** Keep an explicit workspace selection inside the caller's membership set. */
export function workspaceScope(memberIds: string[], requested: string | null) {
  return { in: requested ? memberIds.filter(id => id === requested) : memberIds }
}
