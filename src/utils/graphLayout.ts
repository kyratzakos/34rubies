import { Story } from '../types'

export interface GraphNode {
  id: string
  x: number
  y: number
  depth: number
}

export interface GraphEdge {
  fromId: string
  toId: string
}

export interface GraphLayout {
  nodes: GraphNode[]
  edges: GraphEdge[]
  width: number
  height: number
}

const NODE_WIDTH = 180
const NODE_HEIGHT = 56
const HORIZONTAL_GAP = 40
const VERTICAL_GAP = 80

/**
 * Computes a layered graph layout via BFS depth assignment.
 * Each node is placed at the depth of its first discovery;
 * nodes within the same level are spread horizontally.
 */
export function computeGraphLayout(story: Story, startId: string): GraphLayout {
  const depthMap = new Map<string, number>()
  const edges: GraphEdge[] = []

  const queue: string[] = [startId]
  depthMap.set(startId, 0)

  while (queue.length > 0) {
    const id = queue.shift()!
    const scene = story[id]
    if (!scene) continue

    const parentDepth = depthMap.get(id) ?? 0

    for (const choice of scene.choices) {
      edges.push({ fromId: id, toId: choice.next_id })

      if (!depthMap.has(choice.next_id) && story[choice.next_id]) {
        depthMap.set(choice.next_id, parentDepth + 1)
        queue.push(choice.next_id)
      }
    }
  }

  const levels = new Map<number, string[]>()
  for (const [id, depth] of depthMap) {
    const level = levels.get(depth) ?? []
    level.push(id)
    levels.set(depth, level)
  }

  const maxLevel = Math.max(...levels.keys(), 0)
  let maxNodesInLevel = 1
  for (const ids of levels.values()) {
    if (ids.length > maxNodesInLevel) maxNodesInLevel = ids.length
  }

  const totalWidth = maxNodesInLevel * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP
  const totalHeight = (maxLevel + 1) * (NODE_HEIGHT + VERTICAL_GAP) - VERTICAL_GAP

  const nodes: GraphNode[] = []
  for (let depth = 0; depth <= maxLevel; depth++) {
    const ids = levels.get(depth) ?? []
    const levelWidth = ids.length * (NODE_WIDTH + HORIZONTAL_GAP) - HORIZONTAL_GAP
    const offsetX = (totalWidth - levelWidth) / 2

    for (let i = 0; i < ids.length; i++) {
      nodes.push({
        id: ids[i],
        x: offsetX + i * (NODE_WIDTH + HORIZONTAL_GAP),
        y: depth * (NODE_HEIGHT + VERTICAL_GAP),
        depth,
      })
    }
  }

  return {
    nodes,
    edges,
    width: totalWidth + NODE_WIDTH,
    height: totalHeight + NODE_HEIGHT,
  }
}

export { NODE_WIDTH, NODE_HEIGHT }
