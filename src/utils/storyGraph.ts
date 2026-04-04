import { Story } from '../types'

/** BFS from start, then any scenes not reachable (orphans). */
export function orderedSceneIds(story: Story, startId: string): string[] {
  const start = story[startId]
  if (!start) return Object.keys(story).sort()

  const order: string[] = []
  const seen = new Set<string>()
  const queue: string[] = [startId]

  while (queue.length > 0) {
    const id = queue.shift()
    if (id === undefined || seen.has(id)) continue
    seen.add(id)
    order.push(id)
    const scene = story[id]
    if (!scene) continue
    for (const c of scene.choices) {
      if (story[c.next_id] && !seen.has(c.next_id)) queue.push(c.next_id)
    }
  }

  const orphans = Object.keys(story)
    .filter((id) => !seen.has(id))
    .sort()
  return [...order, ...orphans]
}
