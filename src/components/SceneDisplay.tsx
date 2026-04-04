import { Scene } from '../types'

interface SceneDisplayProps {
  scene: Scene
}

export function SceneDisplay({ scene }: SceneDisplayProps) {
  return (
    <div className="scene-display">
      <p className="scene-message">{scene.message}</p>
    </div>
  )
}
