import { FormEvent, useState } from 'react'
import { Choice, Scene, Story } from '../types'

interface AddSceneFormProps {
  story: Story
  onAddScene: (sceneId: string, scene: Scene) => void
}

interface DraftChoice {
  text: string
  next_id: string
}

const emptyChoice = (): DraftChoice => ({ text: '', next_id: '' })

export function AddSceneForm({ story, onAddScene }: AddSceneFormProps) {
  const [sceneId, setSceneId] = useState('')
  const [message, setMessage] = useState('')
  const [choices, setChoices] = useState<DraftChoice[]>([emptyChoice()])
  const [error, setError] = useState<string | null>(null)

  const sceneIds = Object.keys(story).sort()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const id = sceneId.trim()
    if (!id) {
      setError('Scene id is required.')
      return
    }
    if (!/^[a-z][a-z0-9_]*$/i.test(id)) {
      setError('Use letters, numbers, underscores; start with a letter.')
      return
    }
    if (story[id]) {
      setError('That scene id already exists.')
      return
    }
    const msg = message.trim()
    if (!msg) {
      setError('Message is required.')
      return
    }

    const built: Choice[] = []
    for (const row of choices) {
      const t = row.text.trim()
      const n = row.next_id.trim()
      if (t === '' && n === '') continue
      if (t === '' || n === '') {
        setError('Each choice needs both label and next scene id.')
        return
      }
      built.push({ text: t, next_id: n })
    }

    onAddScene(id, { message: msg, choices: built })
    setSceneId('')
    setMessage('')
    setChoices([emptyChoice()])
    setError(null)
  }

  return (
    <section className="add-scene-section" aria-label="Add new scene">
      <h2 className="editor-section-title">Add a scene</h2>
      <form className="add-scene-form" onSubmit={handleSubmit}>
        {error ? <p className="editor-error">{error}</p> : null}

        <label className="editor-label">
          Scene id
          <input
            className="editor-input"
            value={sceneId}
            onChange={(e) => setSceneId(e.target.value)}
            placeholder="e.g. forest_clearing"
            list="existing-scene-ids"
          />
        </label>

        <label className="editor-label">
          Message
          <textarea
            className="editor-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            placeholder="What the player reads at this scene…"
          />
        </label>

        <fieldset className="choices-fieldset">
          <legend className="choices-legend">Choices (optional)</legend>
          {choices.map((row, idx) => (
            <div key={idx} className="choice-draft-row">
              <input
                className="editor-input"
                value={row.text}
                onChange={(e) => {
                  const next = [...choices]
                  next[idx] = { ...next[idx], text: e.target.value }
                  setChoices(next)
                }}
                placeholder="Button label"
                aria-label={`Choice ${idx + 1} label`}
              />
              <input
                className="editor-input"
                value={row.next_id}
                onChange={(e) => {
                  const next = [...choices]
                  next[idx] = { ...next[idx], next_id: e.target.value }
                  setChoices(next)
                }}
                placeholder="next_id"
                list="existing-scene-ids"
                aria-label={`Choice ${idx + 1} target scene id`}
              />
            </div>
          ))}
          <button
            type="button"
            className="editor-secondary-button"
            onClick={() => setChoices([...choices, emptyChoice()])}
          >
            Add choice row
          </button>
        </fieldset>

        <button type="submit" className="editor-primary-button">
          Save scene to story
        </button>
      </form>

      <datalist id="existing-scene-ids">
        {sceneIds.map((sid) => (
          <option key={sid} value={sid} />
        ))}
      </datalist>
    </section>
  )
}
