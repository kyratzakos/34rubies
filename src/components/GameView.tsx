import { useState } from 'react'
import { Story } from '../types'
import { START_SCENE_ID } from '../constants'
import { SceneDisplay } from './SceneDisplay'
import { ChoiceList } from './ChoiceList'

interface GameViewProps {
  story: Story
  onEditStory: () => void
}

export function GameView({ story, onEditStory }: GameViewProps) {
  const [currentSceneId, setCurrentSceneId] = useState(START_SCENE_ID)

  const currentScene = story[currentSceneId]

  function handleChoiceSelect(nextId: string) {
    setCurrentSceneId(nextId)
  }

  function handleNewGame() {
    setCurrentSceneId(START_SCENE_ID)
  }

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">34 Rubies</h1>
        <div className="app-header-actions">
          <button type="button" className="new-game-button" onClick={handleNewGame}>
            New Game
          </button>
          <button type="button" className="new-game-button new-game-button--accent" onClick={onEditStory}>
            Edit story
          </button>
        </div>
      </header>

      <main className="app-main">
        {currentScene ? (
          <>
            <SceneDisplay scene={currentScene} />
            {currentScene.choices.length > 0 ? (
              <ChoiceList choices={currentScene.choices} onChoiceSelect={handleChoiceSelect} />
            ) : (
              <p className="end-message">— The End —</p>
            )}
          </>
        ) : (
          <p className="end-message">To be continued…</p>
        )}
      </main>
    </>
  )
}
