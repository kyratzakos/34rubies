# 34 Rubies

A browser-based choose-your-own-adventure game. Players navigate a branching narrative by making choices at each scene. The story is persisted in `localStorage`; the bundled `story.json` is the default. It also includes a built-in story editor.

## Tech Stack

| Tool | Purpose |
|------|---------|
| React 18 | UI & component model |
| TypeScript 5 | Type safety |
| Vite 6 | Dev server & bundler |
| ESLint | Linting |

Requires Node.js `22.12.0`.

## Getting Started

```bash
npm install
npm run build      # Production build
npm run dev        # Start dev server
```

## Story Format

Stories are defined in `assets/data/story.json` as a map of scenes:

```json
{
  "scene_id": {
    "message": ["Line 1", "Line 2"],
    "choices": [
      { "text": "Choice label", "next_id": "next_scene_id" }
    ]
  }
}
```

- A scene with no `choices` is treated as an **ending**.
- The entry point is the scene with ID `castle_approach` (defined in `src/constants.ts`).
- See `assets/data/story.example.json` for a reference example.
