import { useEffect, useState } from 'react'
import storyData from '../assets/data/story.json'
import { Story } from './types'
import { isStory, loadBundledHash, loadStoryFromStorage, saveBundledHash, saveStoryToStorage } from './storyStorage'
import { GameView } from './components/GameView'
import { StoryEditorPage } from './components/StoryEditorPage'

function assertBundledStory(data: unknown): Story {
  if (!isStory(data)) throw new Error('Bundled story.json is invalid')
  return data
}

const bundledStory = assertBundledStory(storyData)
const bundledStoryHash = JSON.stringify(bundledStory)

function routeFromHash(): 'play' | 'editor' {
  return window.location.hash === '#/editor' ? 'editor' : 'play'
}

export function App() {
  const [story, setStory] = useState<Story>(() => {
    const stored = loadStoryFromStorage()
    const storedHash = loadBundledHash()
    if (stored && storedHash === bundledStoryHash) return stored
    return bundledStory
  })
  const [route, setRoute] = useState(routeFromHash)

  useEffect(() => {
    saveStoryToStorage(story)
    saveBundledHash(bundledStoryHash)
  }, [story])

  useEffect(() => {
    function onHashChange() {
      setRoute(routeFromHash())
    }
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function goEditor() {
    window.location.hash = '#/editor'
  }

  function goPlay() {
    window.location.hash = ''
  }

  return (
    <div className={route === 'editor' ? 'app app--editor' : 'app'}>
      {route === 'editor' ? (
        <StoryEditorPage
          story={story}
          onStoryChange={setStory}
          onResetToBundled={() => setStory(bundledStory)}
          bundledStory={bundledStory}
          onBack={goPlay}
        />
      ) : (
        <GameView story={story} onEditStory={goEditor} />
      )}
    </div>
  )
}
