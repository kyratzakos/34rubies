import { Story } from '../types'
import { START_SCENE_ID } from '../constants'
import { orderedSceneIds } from '../utils/storyGraph'

interface StoryConnectionsProps {
  story: Story
}

export function StoryConnections({ story }: StoryConnectionsProps) {
  const ids = orderedSceneIds(story, START_SCENE_ID)
  const allIds = new Set(Object.keys(story))

  return (
    <section className="story-connections" aria-label="Story map">
      <h2 className="editor-section-title">Scenes &amp; choices</h2>
      <p className="editor-hint">
        Each choice points to a <code className="inline-code">next_id</code> scene. Start:{' '}
        <code className="inline-code">{START_SCENE_ID}</code>.
      </p>
      <ul className="story-map-list">
        {ids.map((id) => {
          const scene = story[id]
          if (!scene) return null
          const preview =
            scene.message.length > 120 ? `${scene.message.slice(0, 120)}…` : scene.message

          return (
            <li key={id} className="story-map-node">
              <div className="story-map-node-header">
                <span className="story-map-id">{id}</span>
                {id === START_SCENE_ID ? <span className="story-map-badge">start</span> : null}
              </div>
              <p className="story-map-message">{preview}</p>
              {scene.choices.length === 0 ? (
                <p className="story-map-end">Ending (no choices)</p>
              ) : (
                <ul className="story-map-choices">
                  {scene.choices.map((choice, idx) => {
                    const targetExists = allIds.has(choice.next_id)
                    return (
                      <li key={`${id}-${idx}`} className="story-map-choice-row">
                        <span className="story-map-choice-text">&ldquo;{choice.text}&rdquo;</span>
                        <span className="story-map-arrow" aria-hidden>
                          →
                        </span>
                        <code className={`inline-code story-map-target${targetExists ? '' : ' is-missing'}`}>
                          {choice.next_id}
                        </code>
                        {!targetExists ? (
                          <span className="story-map-warn" title="No scene with this id">
                            missing
                          </span>
                        ) : null}
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
