import { Scene } from '../types'

interface SceneDisplayProps {
  scene: Scene
}

export function SceneDisplay({ scene }: SceneDisplayProps) {
  return (
    <div className="scene-display">
      {scene.message.map((line, idx) => (
        <p key={idx} className="scene-message">
          {line}
        </p>
      ))}
    </div>
  )
}
