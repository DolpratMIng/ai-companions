export interface Character {
  id: string
  name: string
  modelUrl: string
  position: [number, number, number]
  scale: number
  chatHistory: Message[]
  isSpeaking: boolean
  expression: 'idle' | 'happy' | 'sad' | 'surprised' | 'thinking'
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

export interface CharacterPreset {
  id: string
  name: string
  modelUrl: string
  description: string
}
