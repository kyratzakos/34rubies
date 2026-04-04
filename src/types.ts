export interface Choice {
  text: string
  next_id: string
}

export interface Scene {
  message: string[]
  choices: Choice[]
}

export type Story = Record<string, Scene>
