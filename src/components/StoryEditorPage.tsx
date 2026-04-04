import { Scene, Story } from '../types'
import { StoryConnections } from './StoryConnections'
import { AddSceneForm } from './AddSceneForm'
import { downloadStoryJson } from '../storyStorage'

interface StoryEditorPageProps {
  story: Story
  onStoryChange: (next: Story) => void
  onResetToBundled: () => void
  bundledStory: Story
  onBack: () => void
}

export function StoryEditorPage({
  story,
  onStoryChange,
  onResetToBundled,
  bundledStory,
  onBack,
}: StoryEditorPageProps) {
  function handleAddScene(sceneId: string, scene: Scene) {
    onStoryChange({ ...story, [sceneId]: scene })
  }

  const isModified = JSON.stringify(story) !== JSON.stringify(bundledStory)

  return (
    <div className="editor-page">
      <header className="editor-header">
        <h1 className="app-title">Story editor</h1>
        <div className="editor-header-actions">
          <button type="button" className="new-game-button" onClick={onBack}>
            Back to game
          </button>
        </div>
      </header>

      <p className="editor-intro">
        Edits are saved in this browser ({isModified ? 'custom story active' : 'matches bundled JSON'}). Download JSON to
        update <code className="inline-code">storyV2.json</code> in the project.
      </p>

      <div className="editor-toolbar">
        <button type="button" className="editor-primary-button" onClick={() => downloadStoryJson(story, 'storyV2.json')}>
          Download JSON
        </button>
        <button
          type="button"
          className="editor-secondary-button"
          onClick={() => {
            if (window.confirm('Discard local edits and reload the story from the app bundle?')) onResetToBundled()
          }}
        >
          Reset to bundled story
        </button>
      </div>

      <StoryConnections story={story} />
      <AddSceneForm story={story} onAddScene={handleAddScene} />
    </div>
  )
}
