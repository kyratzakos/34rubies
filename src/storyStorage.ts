import { Choice, Scene, Story } from './types'
import { STORY_STORAGE_KEY } from './constants'

function isChoice(value: unknown): value is Choice {
  if (typeof value !== 'object' || value === null) return false
  if (!('text' in value) || !('next_id' in value)) return false
  return typeof value.text === 'string' && typeof value.next_id === 'string'
}

function isScene(value: unknown): value is Scene {
  if (typeof value !== 'object' || value === null) return false
  if (!('message' in value) || !('choices' in value)) return false
  if (typeof value.message !== 'string' || !Array.isArray(value.choices)) return false
  return value.choices.every((c) => isChoice(c))
}

export function isStory(value: unknown): value is Story {
  if (typeof value !== 'object' || value === null) return false
  return Object.entries(value).every(([key, val]) => typeof key === 'string' && isScene(val))
}

export function loadStoryFromStorage(): Story | null {
  try {
    const raw = localStorage.getItem(STORY_STORAGE_KEY)
    if (!raw) return null
    const parsed: unknown = JSON.parse(raw)
    return isStory(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function saveStoryToStorage(story: Story): void {
  try {
    localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(story, null, 2))
  } catch {
    // ignore quota / private mode
  }
}

export function downloadStoryJson(story: Story, filename: string): void {
  const blob = new Blob([JSON.stringify(story, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
