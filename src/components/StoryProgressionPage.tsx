import { useMemo, useState } from 'react'
import { Story } from '../types'
import { START_SCENE_ID } from '../constants'
import { computeGraphLayout, NODE_WIDTH, NODE_HEIGHT } from '../utils/graphLayout'

interface StoryProgressionPageProps {
  story: Story
  visitedSceneIds: Set<string>
  onBack: () => void
}

const SVG_PADDING = 60

export function StoryProgressionPage({ story, visitedSceneIds, onBack }: StoryProgressionPageProps) {
  const [fogDisabled, setFogDisabled] = useState(false)

  const layout = useMemo(() => computeGraphLayout(story, START_SCENE_ID), [story])

  const nodePositions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>()
    for (const node of layout.nodes) {
      map.set(node.id, { x: node.x, y: node.y })
    }
    return map
  }, [layout])

  const svgWidth = layout.width + SVG_PADDING * 2
  const svgHeight = layout.height + SVG_PADDING * 2

  return (
    <div className="progression-page">
      <header className="app-header">
        <h1 className="app-title">Story Progression</h1>
        <div className="app-header-actions">
          <button type="button" className="new-game-button" onClick={onBack}>
            Back to game
          </button>
          <button
            type="button"
            className={fogDisabled ? 'new-game-button new-game-button--accent' : 'new-game-button'}
            onClick={() => setFogDisabled((prev) => !prev)}
          >
            {fogDisabled ? 'Enable fog' : 'Disable fog'}
          </button>
        </div>
      </header>

      <div className="progression-scroll-container">
        <svg
          className="progression-svg"
          width={svgWidth}
          height={svgHeight}
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <defs>
            <filter id="fog-blur">
              <feGaussianBlur stdDeviation="3" />
            </filter>
            <filter id="fog-mist">
              <feGaussianBlur stdDeviation="2.5" />
              <feColorMatrix type="matrix" values="0.3 0 0 0 0.05  0 0.3 0 0 0.04  0 0 0.3 0 0.03  0 0 0 0.55 0" />
            </filter>
          </defs>

          {layout.edges.map((edge, i) => {
            const from = nodePositions.get(edge.fromId)
            const to = nodePositions.get(edge.toId)
            if (!from || !to) return null

            const x1 = from.x + NODE_WIDTH / 2 + SVG_PADDING
            const y1 = from.y + NODE_HEIGHT + SVG_PADDING
            const x2 = to.x + NODE_WIDTH / 2 + SVG_PADDING
            const y2 = to.y + SVG_PADDING

            const isVisible = fogDisabled || (visitedSceneIds.has(edge.fromId) && visitedSceneIds.has(edge.toId))

            const midY = (y1 + y2) / 2

            return (
              <path
                key={i}
                d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
                className={isVisible ? 'progression-edge' : 'progression-edge progression-edge--fogged'}
              />
            )
          })}

          {layout.nodes.map((node) => {
            const isVisited = visitedSceneIds.has(node.id)
            const showClear = fogDisabled || isVisited

            const nx = node.x + SVG_PADDING
            const ny = node.y + SVG_PADDING

            return (
              <g key={node.id} filter={showClear ? undefined : 'url(#fog-mist)'}>
                <rect
                  x={nx}
                  y={ny}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  rx={4}
                  className={showClear ? 'progression-node progression-node--visited' : 'progression-node'}
                />
                <text
                  x={nx + NODE_WIDTH / 2}
                  y={ny + NODE_HEIGHT / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className={showClear ? 'progression-node-label' : 'progression-node-label progression-node-label--fogged'}
                >
                  {showClear ? formatNodeLabel(node.id) : '???'}
                </text>
              </g>
            )
          })}
        </svg>
      </div>
    </div>
  )
}

function formatNodeLabel(id: string): string {
  return id.replace(/_/g, ' ')
}
