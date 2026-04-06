import { useCallback, useEffect, useState } from 'react'
import storyData from '../assets/data/story.json'
import { Story } from './types'
import { isStory, loadBundledHash, loadStoryFromStorage, saveBundledHash, saveStoryToStorage } from './storyStorage'
import { START_SCENE_ID } from './constants'
import { GameView } from './components/GameView'
import { StoryEditorPage } from './components/StoryEditorPage'
import { StoryProgressionPage } from './components/StoryProgressionPage'

function assertBundledStory(data: unknown): Story {
  if (!isStory(data)) throw new Error('Bundled story.json is invalid')
  return data
}

const bundledStory = assertBundledStory(storyData)
const bundledStoryHash = JSON.stringify(bundledStory)

type Route = 'play' | 'editor' | 'progression'

function routeFromHash(): Route {
  const hash = window.location.hash
  if (hash === '#/editor') return 'editor'
  if (hash === '#/progression') return 'progression'
  return 'play'
}

export function App() {
  const [story, setStory] = useState<Story>(() => {
    const stored = loadStoryFromStorage()
    const storedHash = loadBundledHash()
    if (stored && storedHash === bundledStoryHash) return stored
    return bundledStory
  })
  const [route, setRoute] = useState(routeFromHash)
  const [currentSceneId, setCurrentSceneId] = useState(START_SCENE_ID)
  const [visitedSceneIds, setVisitedSceneIds] = useState<Set<string>>(() => new Set([START_SCENE_ID]))

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

  const handleSceneChange = useCallback((nextId: string) => {
    setCurrentSceneId(nextId)
    setVisitedSceneIds((prev) => {
      if (prev.has(nextId)) return prev
      const next = new Set(prev)
      next.add(nextId)
      return next
    })
  }, [])

  const handleNewGame = useCallback(() => {
    setCurrentSceneId(START_SCENE_ID)
    setVisitedSceneIds(new Set([START_SCENE_ID]))
  }, [])

  function goEditor() {
    window.location.hash = '#/editor'
  }

  function goPlay() {
    window.location.hash = ''
  }

  function goProgression() {
    window.location.hash = '#/progression'
  }

  const appClass = route === 'editor' || route === 'progression' ? 'app app--editor' : 'app'

  return (
    <div className={appClass}>
      {route === 'editor' && (
        <StoryEditorPage
          story={story}
          onStoryChange={setStory}
          onResetToBundled={() => setStory(bundledStory)}
          bundledStory={bundledStory}
          onBack={goPlay}
        />
      )}
      {route === 'progression' && (
        <StoryProgressionPage story={story} visitedSceneIds={visitedSceneIds} onBack={goPlay} />
      )}
      {route === 'play' && (
        <GameView
          story={story}
          currentSceneId={currentSceneId}
          onSceneChange={handleSceneChange}
          onNewGame={handleNewGame}
          onEditStory={goEditor}
          onProgression={goProgression}
        />
      )}
    </div>
  )
}
