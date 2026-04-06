import { Story } from '../types'
import { SceneDisplay } from './SceneDisplay'
import { ChoiceList } from './ChoiceList'

interface GameViewProps {
  story: Story
  currentSceneId: string
  onSceneChange: (nextId: string) => void
  onNewGame: () => void
  onEditStory: () => void
  onProgression: () => void
}

export function GameView({ story, currentSceneId, onSceneChange, onNewGame, onEditStory, onProgression }: GameViewProps) {
  const currentScene = story[currentSceneId]

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">34 Rubies</h1>
        <div className="app-header-actions">
          <button type="button" className="new-game-button" onClick={onNewGame}>
            New Game
          </button>
          <button type="button" className="new-game-button" onClick={onProgression}>
            Progression
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
              <ChoiceList choices={currentScene.choices} onChoiceSelect={onSceneChange} />
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
